
export type EditorAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'h1'
  | 'h2'
  | 'ul'
  | 'ol'
  | 'link';

export function applyEditorAction(
  action: EditorAction,
  value: string,
  start: number,
  end: number
) {
  const selected = value.slice(start, end);
  let updated = value;

  const wrap = (before: string, after = before) =>
    value.slice(0, start) + before + selected + after + value.slice(end);

  switch (action) {
    case 'bold':
      updated = wrap('**');
      break;
    case 'italic':
      updated = wrap('_');
      break;
    case 'underline':
      updated = wrap('<u>', '</u>');
      break;
    case 'strike':
      updated = wrap('~~');
      break;
    case 'h1':
      updated = wrap('# ');
      break;
    case 'h2':
      updated = wrap('## ');
      break;
    case 'ul':
      updated = `- ${value}`;
      break;
    case 'ol':
      updated = `1. ${value}`;
      break;
    case 'link':
      updated = wrap('[', '](url)');
      break;
  }

  return updated;
}
