'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Code,
  Paperclip,
  ChevronDown,
  Highlighter,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import HeadingIcon from '../reusable/icons/HeadingIcon';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  children,
  title,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`h-8 px-2 flex items-center justify-center hover:bg-white/10 rounded transition-colors ${
      isActive ? 'bg-white/20' : ''
    }`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-white/20 mx-1" />;

interface RichTextEditorProps {
  value?: string;
  onChange: (val: string) => void;

  /**
   * Only true for Explanation editor.
   */
  allowImageUpload?: boolean;

  /**
   * Parent form will receive the actual file and send it as:
   * explanation_image: binary
   */
  onImageFileChange?: (file: File | null) => void;
}

export function RichTextEditor({
  value = '',
  onChange,
  allowImageUpload = false,
  onImageFileChange,
}: RichTextEditorProps) {
  const [fontSize, setFontSize] = useState('20px');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  const removeExistingImagesFromEditor = () => {
    if (!editor) return;

    const html = editor.getHTML();
    const cleanedHtml = html
      .replace(/<img\b[^>]*>/gi, '')
      .replace(/<p>\s*<\/p>/gi, '');

    if (cleanedHtml !== html) {
      editor.commands.setContent(cleanedHtml);
      onChange(cleanedHtml);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !allowImageUpload || !editor) {
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      e.target.value = '';
      return;
    }

    /**
     * One explanation image only.
     * If user selects a new image, old image from editor will be replaced.
     */
    removeExistingImagesFromEditor();

    /**
     * Blob is only for frontend preview.
     * On submit, parent will replace blob src with file.name.
     */
    const previewUrl = URL.createObjectURL(file);

    onImageFileChange?.(file);

    editor
      .chain()
      .focus()
      .setImage({
        src: previewUrl,
        alt: file.name,
        title: file.name,
      })
      .run();

    e.target.value = '';
  };

  if (!editor) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 background flex-wrap">
        {/* Text Style Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-8 px-3 flex items-center gap-1 hover:bg-white/10 rounded transition-colors text-white"
            >
              <span className="text-lg font-bold">
                <HeadingIcon />
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              Normal Text
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Highlight */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-8 px-2 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
              title="Highlight"
            >
              <Highlighter className="w-5 h-5 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: '#fef08a' })
                  .run()
              }
            >
              Yellow Highlight
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: '#bbf7d0' })
                  .run()
              }
            >
              Green Highlight
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: '#fed7aa' })
                  .run()
              }
            >
              Orange Highlight
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: '#fecaca' })
                  .run()
              }
            >
              Red Highlight
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              Remove Highlight
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarDivider />

        {/* Bold */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-5 h-5 text-white" />
        </ToolbarButton>

        {/* Italic */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-5 h-5 text-white" />
        </ToolbarButton>

        {/* Underline */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20h10M7 4v8a5 5 0 0010 0V4"
            />
          </svg>
        </ToolbarButton>

        {/* Strikethrough */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="w-5 h-5 text-white" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-8 px-3 flex items-center gap-1 hover:bg-white/10 rounded transition-colors text-white font-medium"
            >
              <span>{fontSize.replace('px', '')}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {['12px', '14px', '16px', '18px', '20px', '24px', '32px'].map(
              size => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setMark('textStyle', { fontSize: size })
                      .run();
                    setFontSize(size);
                  }}
                >
                  {size}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarDivider />

        {/* Align Left */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-5 h-5 text-white" />
        </ToolbarButton>

        {/* Align Center */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-5 h-5 text-white" />
        </ToolbarButton>

        {/* Align Right */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-5 h-5 text-white" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <span className="text-white font-bold text-sm">H1</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <span className="text-white font-bold text-sm">H2</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <span className="text-white font-bold text-sm">H3</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          isActive={editor.isActive('heading', { level: 4 })}
          title="Heading 4"
        >
          <span className="text-white font-bold text-sm">H4</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          isActive={editor.isActive('heading', { level: 5 })}
          title="Heading 5"
        >
          <span className="text-white font-bold text-sm">H5</span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-5 h-5 text-white" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-5 h-5 text-white" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Code Block */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code className="w-5 h-5 text-white" />
        </ToolbarButton>

        {/* Image Upload Button - only Explanation editor */}
        {allowImageUpload && (
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            title="Upload Explanation Image"
          >
            <Paperclip className="w-5 h-5 text-white outline" />
          </ToolbarButton>
        )}
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] bg-[#f8f8f4] p-4">
        <EditorContent
          editor={editor}
          className="
            focus:outline-none
            [&_.ProseMirror]:focus:outline-none
            [&_.ProseMirror]:outline-none
            [&_.ProseMirror_img]:max-w-full
            [&_.ProseMirror_img]:rounded-lg
            [&_.ProseMirror_img]:my-3
          "
          style={{
            fontSize,
          }}
        />
      </div>

      {/* Hidden Image Input */}
      {allowImageUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      )}
    </div>
  );
}
