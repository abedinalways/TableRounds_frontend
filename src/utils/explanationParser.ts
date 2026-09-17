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

export interface ParsedAnswerOption {
  letter: string;
  text: string;
  isCorrect: boolean;
}

export interface ParsedMasterQuestion {
  stemHtml: string;
  options: ParsedAnswerOption[];
  explanation: ParsedExplanation;
  rawExplanationHtml: string;
  hasMasterContent: boolean;
  correctLetter: string | null;
}

/**
 * Parses an entire question (Stem + Options + Explanation block) from 1 large paste.
 */
export function parseMasterQuestion(raw: string): ParsedMasterQuestion {
  if (!raw || typeof raw !== 'string') {
    return {
      stemHtml: '',
      options: [],
      explanation: parseAllInOneExplanation(''),
      rawExplanationHtml: '',
      hasMasterContent: false,
      correctLetter: null,
    };
  }

  const trimmed = raw.trim();
  if (!trimmed || trimmed === '<p></p>') {
    return {
      stemHtml: '',
      options: [],
      explanation: parseAllInOneExplanation(''),
      rawExplanationHtml: '',
      hasMasterContent: false,
      correctLetter: null,
    };
  }

  // 1. Find where Explanation block starts
  const explanationPattern =
    /(?:^|\n|<p[^>]*>|<h[1-6][^>]*>|<div[^>]*>)?\s*(?:<strong>|<b>)?\s*(?:(?:1|step\s*1)\.\s*)?Explanation\s*[:：]?(?:\s*<\/strong>|\s*<\/b>)?(?:\s*<\/p>|\s*<\/h[1-6]>)?/i;

  const explanationMatch = raw.match(explanationPattern);

  let questionPart = raw;
  let rawExplanationHtml = '';

  if (explanationMatch && explanationMatch.index !== undefined) {
    questionPart = raw.slice(0, explanationMatch.index).trim();
    rawExplanationHtml = raw.slice(explanationMatch.index).trim();
  }

  // 2. Parse answer choices (A-G) from questionPart
  const optionRegex =
    /(?:<p[^>]*>|<li[^>]*>|^|\n)\s*([*•\s]*)\(?([A-Ga-g])[\.\)\:-]\s*([\s\S]*?)(?=(?:<\/p>|<\/li>|<p[^>]*>|<li[^>]*>|\n\s*[*•\s]*\(?[A-Ga-g][\.\)\:-]|$))(?:\s*<\/p>|\s*<\/li>)?/gi;

  const options: ParsedAnswerOption[] = [];
  let firstOptionIndex = -1;
  let match: RegExpExecArray | null;

  while ((match = optionRegex.exec(questionPart)) !== null) {
    const rawMatchIndex = match.index;
    const marker = match[1] || '';
    const letter = match[2].toUpperCase();
    let text = match[3].replace(/<[^>]+>/g, '').trim();
    if (!text) continue;

    if (firstOptionIndex === -1) {
      firstOptionIndex = rawMatchIndex;
    }

    const isExplicitCorrect =
      marker.includes('*') ||
      text.toLowerCase().includes('(correct)') ||
      text.toLowerCase().includes('[correct]');

    // Strip trailing markers from choice text
    text = text
      .replace(/\s*\((?:correct|answer)\)\s*$/i, '')
      .replace(/\s*\[(?:correct|answer)\]\s*$/i, '')
      .trim();

    options.push({
      letter,
      text,
      isCorrect: isExplicitCorrect,
    });
  }

  // 3. Extract Stem (everything before first option)
  let stemHtml = questionPart;
  if (firstOptionIndex !== -1) {
    stemHtml = questionPart.slice(0, firstOptionIndex).trim();
  }

  // Clean trailing empty tags or linebreaks from stem
  stemHtml = stemHtml
    .replace(/(?:<p>\s*<\/p>\s*)+$/i, '')
    .replace(/(?:<br\s*\/?>\s*)+$/i, '')
    .trim();

  // If stem is plain text without HTML paragraph tags, format with paragraphs
  if (stemHtml.length > 0 && !stemHtml.startsWith('<')) {
    stemHtml = stemHtml
      .split(/\n{2,}/)
      .map(para => `<p>${para.trim().replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }

  // 4. Check for answer designation at bottom or in text (e.g. "Answer: B" or "Correct Answer: C")
  const answerKeyMatch = raw.match(
    /(?:Correct\s+Answer|Answer|Key)\s*[:：]\s*([A-Ga-g])/i,
  );
  let resolvedCorrectLetter: string | null = null;

  if (answerKeyMatch && answerKeyMatch[1]) {
    resolvedCorrectLetter = answerKeyMatch[1].toUpperCase();
    options.forEach(opt => {
      opt.isCorrect = opt.letter === resolvedCorrectLetter;
    });
  } else {
    const explicitCorrect = options.find(o => o.isCorrect);
    if (explicitCorrect) {
      resolvedCorrectLetter = explicitCorrect.letter;
    } else if (options.length > 0) {
      // Default to first choice if no choice was explicitly marked
      options[0].isCorrect = true;
      resolvedCorrectLetter = options[0].letter;
    }
  }

  const parsedExplanation = parseAllInOneExplanation(rawExplanationHtml);

  const hasMasterContent =
    stemHtml.length > 0 ||
    options.length > 0 ||
    rawExplanationHtml.length > 0;

  return {
    stemHtml,
    options,
    explanation: parsedExplanation,
    rawExplanationHtml,
    hasMasterContent,
    correctLetter: resolvedCorrectLetter,
  };
}
