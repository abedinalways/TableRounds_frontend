'use client';

import { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { EditorToolbar } from './EditorToolbar';
import { applyEditorAction, EditorAction } from '@/lib/editorActions';

interface QuestionFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function QuestionField({
  label,
  value,
  onChange,
  placeholder,
}: QuestionFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAction = (action: EditorAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const updated = applyEditorAction(action, value ?? '', start, end);
    onChange(updated);

    // restore focus
    setTimeout(() => textarea.focus(), 0);
  };

  return (
    <div className="space-y-2">
      <label className="text-[16px] font-bold text-[#01281e]">{label}</label>

      <div className="rounded-md border overflow-hidden">
        <EditorToolbar onAction={handleAction} />

        <Textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-none focus-visible:ring-0 min-h-[120px] resize-none"
        />
      </div>
    </div>
  );
}
