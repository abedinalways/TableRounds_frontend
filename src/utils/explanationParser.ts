export interface ParsedExplanation {
  explanation: string;
  keyPoints: string; // Maps to why_incorrect
  keepingPoint: string; // Maps to pimping_point
  memoryTrick: string; // Maps to memory_trick
  referance: string; // Maps to referance
}

export interface SectionMeta {
  key: keyof ParsedExplanation;
  label: string;
  detected: boolean;
  length: number;
}

interface SectionDefinition {
  key: keyof ParsedExplanation;
  label: string;
  pattern: RegExp;
}

const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    key: 'explanation',
    label: 'Explanation',
    pattern:
      /(?:^|<p[^>]*>|<h[1-6][^>]*>|<div[^>]*>)?\s*(?:<strong>|<b>)?\s*(?:(?:1|step\s*1)\.\s*)?Explanation\s*[:：]?(?:\s*<\/strong>|\s*<\/b>)?(?:\s*<\/p>|\s*<\/h[1-6]>)?/i,
  },
  {
    key: 'keyPoints',
    label: 'Incorrect Answers',
    pattern:
      /(?:^|<p[^>]*>|<h[1-6][^>]*>|<div[^>]*>)?\s*(?:<strong>|<b>)?\s*(?:(?:2|step\s*2)\.\s*)?(?:Incorrect\s*Answers?|Why\s*The\s*Other\s*Options\s*Are\s*Incorrect|Why\s*Other\s*Options\s*Are\s*Incorrect|Why\s*Incorrect|Incorrect\s*Options?|Distractor\s*Explanations?)\s*[:：]?(?:\s*<\/strong>|\s*<\/b>)?(?:\s*<\/p>|\s*<\/h[1-6]>)?/i,
  },
  {
    key: 'keepingPoint',
    label: 'Pimping Point',
    pattern:
      /(?:^|<p[^>]*>|<h[1-6][^>]*>|<div[^>]*>)?\s*(?:<strong>|<b>)?\s*(?:(?:3|step\s*3)\.\s*)?(?:Pimping\s*Points?|High[- ]Yield\s*Points?|Clinical\s*Pearls?)\s*[:：]?(?:\s*<\/strong>|\s*<\/b>)?(?:\s*<\/p>|\s*<\/h[1-6]>)?/i,
  },
  {
    key: 'memoryTrick',
    label: 'Memory Trick',
    pattern:
      /(?:^|<p[^>]*>|<h[1-6][^>]*>|<div[^>]*>)?\s*(?:<strong>|<b>)?\s*(?:(?:4|step\s*4)\.\s*)?(?:Memory\s*Tricks?|Mnemonics?)\s*[:：]?(?:\s*<\/strong>|\s*<\/b>)?(?:\s*<\/p>|\s*<\/h[1-6]>)?/i,
  },
  {
    key: 'referance',
    label: 'References',
    pattern:
      /(?:^|<p[^>]*>|<h[1-6][^>]*>|<div[^>]*>)?\s*(?:<strong>|<b>)?\s*(?:(?:5|step\s*5)\.\s*)?(?:References?|Sources?)\s*[:：]?(?:\s*<\/strong>|\s*<\/b>)?(?:\s*<\/p>|\s*<\/h[1-6]>)?/i,
  },
];

/**
 * Parses all-in-one explanation HTML (or plain text) into 5 discrete sections.
 * Preserves inner HTML formatting (bold, italics, lists, paragraphs).
 */
export function parseAllInOneExplanation(raw: string): ParsedExplanation {
  const emptyResult: ParsedExplanation = {
    explanation: '',
    keyPoints: '',
    keepingPoint: '',
    memoryTrick: '',
    referance: '',
  };

  if (!raw || typeof raw !== 'string') {
    return emptyResult;
  }

  const trimmed = raw.trim();
  if (!trimmed || trimmed === '<p></p>') {
    return emptyResult;
  }

  // Find occurrences of recognized heading patterns
  const matches: Array<{
    key: keyof ParsedExplanation;
    index: number;
    length: number;
  }> = [];

  for (const sec of SECTION_DEFINITIONS) {
    const match = raw.match(sec.pattern);
    if (match && match.index !== undefined) {
      matches.push({
        key: sec.key,
        index: match.index,
        length: match[0].length,
      });
    }
  }

  // If no sections recognized at all, treat the entire text as 'explanation'
  if (matches.length === 0) {
    return {
      ...emptyResult,
      explanation: trimmed,
    };
  }

  // Sort matched sections in order of their appearance in the text
  matches.sort((a, b) => a.index - b.index);

  const result: ParsedExplanation = { ...emptyResult };

  // If there is content before the first recognized heading, assign to explanation
  if (matches[0].index > 0 && matches[0].key !== 'explanation') {
    const preHeading = raw.slice(0, matches[0].index).trim();
    if (preHeading && preHeading !== '<p></p>') {
      result.explanation = cleanSectionHtml(preHeading);
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const startIndex = current.index + current.length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const rawSection = raw.slice(startIndex, endIndex);

    result[current.key] = cleanSectionHtml(rawSection);
  }

  return result;
}

/**
 * Cleans dangling or orphaned tags resulting from splitting around headings.
 */
function cleanSectionHtml(html: string): string {
  let cleaned = html.trim();

  // Strip leading tags left over if the heading was inside an inline wrapper
  cleaned = cleaned
    .replace(/^<\/strong>\s*<\/p>/i, '')
    .replace(/^<\/b>\s*<\/p>/i, '')
    .replace(/^<\/strong>/i, '')
    .replace(/^<\/b>/i, '')
    .replace(/^<\/h[1-6]>/i, '')
    .replace(/^<\/p>/i, '')
    .replace(/^[:：\s-]+/, '')
    .trim();

  // If the section begins with text and ends with </p>, restore the opening <p>
  if (cleaned.length > 0 && !cleaned.startsWith('<') && cleaned.endsWith('</p>')) {
    cleaned = '<p>' + cleaned;
  }

  // Remove trailing empty paragraphs
  cleaned = cleaned.replace(/(?:<p>\s*<\/p>\s*)+$/i, '').trim();

  return cleaned;
}

/**
 * Returns metadata about which sections are populated in the parsed result.
 */
export function getSectionMetas(parsed: ParsedExplanation): SectionMeta[] {
  return SECTION_DEFINITIONS.map(def => {
    const content = parsed[def.key] || '';
    // Strip HTML to count raw text characters
    const plainText = content.replace(/<[^>]+>/g, '').trim();

    return {
      key: def.key,
      label: def.label,
      detected: plainText.length > 0,
      length: plainText.length,
    };
  });
}
