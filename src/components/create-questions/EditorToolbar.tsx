
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link,
} from 'lucide-react';
import { EditorAction } from '@/lib/editorActions';

interface Props {
  onAction: (action: EditorAction) => void;
}

export function EditorToolbar({ onAction }: Props) {
  return (
    <div className="bg-[#018060] p-2 flex gap-1 text-white flex-wrap">
      <Button size="icon" variant="ghost" onClick={() => onAction('bold')}>
        <Bold />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => onAction('italic')}>
        <Italic />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => onAction('underline')}>
        <Underline />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => onAction('strike')}>
        <Strikethrough />
      </Button>

      <Button size="icon" variant="ghost" onClick={() => onAction('h1')}>
        <Heading1 />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => onAction('h2')}>
        <Heading2 />
      </Button>

      <Button size="icon" variant="ghost" onClick={() => onAction('ul')}>
        <List />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => onAction('ol')}>
        <ListOrdered />
      </Button>

      <Button size="icon" variant="ghost" onClick={() => onAction('link')}>
        <Link />
      </Button>
    </div>
  );
}
