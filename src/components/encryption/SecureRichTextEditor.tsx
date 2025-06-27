import React, { useState, useRef, useEffect } from 'react';
import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import './tiptap-tasklist-fix.css';

interface SecureRichTextEditorProps {
  value: any;
  onChange: (json: any) => void;
  editable?: boolean;
  onEditorReady?: (editor: any) => void;
}

const formattingShortcuts = [
  { label: 'Bold', keys: 'Ctrl+B / Cmd+B', action: 'toggleBold' },
  { label: 'Italic', keys: 'Ctrl+I / Cmd+I', action: 'toggleItalic' },
  { label: 'Underline', keys: 'Ctrl+U / Cmd+U', action: 'toggleUnderline' },
  { label: 'Strikethrough', keys: 'Ctrl+Shift+X / Cmd+Shift+X', action: 'toggleStrike' },
  { label: 'Bullet List', keys: 'Ctrl+Shift+8 / Cmd+Shift+8', action: 'toggleBulletList' },
  { label: 'Numbered List', keys: 'Ctrl+Shift+7 / Cmd+Shift+7', action: 'toggleOrderedList' },
  { label: 'Checklist', keys: 'Cmd+Shift+9', action: 'toggleTaskList' },
  { label: 'Horizontal Rule', keys: 'Ctrl+Alt+- / Cmd+Alt+-', action: 'setHorizontalRule' },
  { label: 'Align Left', keys: 'Ctrl+Shift+L / Cmd+Shift+L', action: 'setTextAlign left' },
  { label: 'Align Center', keys: 'Ctrl+Shift+E / Cmd+Shift+E', action: 'setTextAlign center' },
  { label: 'Align Right', keys: 'Ctrl+Shift+R / Cmd+Shift+R', action: 'setTextAlign right' },
  { label: 'Undo', keys: 'Ctrl+Z / Cmd+Z', action: 'undo' },
  { label: 'Redo', keys: 'Ctrl+Y / Cmd+Shift+Z', action: 'redo' },
];

export const SecureRichTextEditor: React.FC<SecureRichTextEditorProps> = ({ value, onChange, editable = true, onEditorReady }) => {
  const [showHelp, setShowHelp] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [
      // Use StarterKit but exclude some extensions to avoid conflicts
      StarterKit.configure({
        heading: false,  // Disable headings completely
        horizontalRule: false,  // We'll add this separately
        bulletList: false,  // Exclude to avoid conflicts
        orderedList: false, // Exclude to avoid conflicts
        listItem: false,    // Exclude to avoid conflicts
      }),
      // Add horizontal rule
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'tiptap-hr',
        },
      }),
      // Add text alignment
      TextAlign.configure({
        types: ['paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      // Add underline
      Underline,
      // Add list extensions explicitly
      BulletList.configure({
        HTMLAttributes: {
          class: 'tiptap-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'tiptap-ordered-list',
        },
      }),
      ListItem,
      TaskList,
      TaskItem,
      // Add placeholder for better UX
      Placeholder.configure({
        placeholder: editable ? 'Start typing your message here...' : '',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    editable,
    autofocus: false, // Disable autofocus to prevent page scroll on load
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Update editor content when value prop changes (for clearing, etc.)
  useEffect(() => {
    if (editor && editor.getJSON() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Focus editor on click anywhere in the box
  useEffect(() => {
    if (!editorRef.current) return;
    const handleClick = () => {
      if (editor && editable) editor.commands.focus();
    };
    const ref = editorRef.current;
    ref.addEventListener('click', handleClick);
    return () => ref.removeEventListener('click', handleClick);
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar - only show when editable */}
      {editable && (
        <>
          <div className="flex flex-wrap gap-1 mb-2">
            {/* Text formatting */}
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold" className={editor.isActive('bold') ? 'bg-secure-100' : ''}><b>B</b></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic" className={editor.isActive('italic') ? 'bg-secure-100' : ''}><i>I</i></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleUnderline().run()} aria-label="Underline" className={editor.isActive('underline') ? 'bg-secure-100' : ''}><u>U</u></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleStrike().run()} aria-label="Strikethrough" className={editor.isActive('strike') ? 'bg-secure-100' : ''}><s>S</s></Button>
            
            {/* Text alignment */}
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().setTextAlign('left').run()} aria-label="Align Left" className={editor.isActive({ textAlign: 'left' }) ? 'bg-secure-100' : ''}>
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().setTextAlign('center').run()} aria-label="Align Center" className={editor.isActive({ textAlign: 'center' }) ? 'bg-secure-100' : ''}>
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().setTextAlign('right').run()} aria-label="Align Right" className={editor.isActive({ textAlign: 'right' }) ? 'bg-secure-100' : ''}>
              <AlignRight className="h-3.5 w-3.5" />
            </Button>
            
            {/* Lists */}
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet List" className={editor.isActive('bulletList') ? 'bg-secure-100' : ''}>• List</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Numbered List" className={editor.isActive('orderedList') ? 'bg-secure-100' : ''}>1. List</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleTaskList().run()} aria-label="Checklist" className={editor.isActive('taskList') ? 'bg-secure-100' : ''}>☑ Checklist</Button>
            
            {/* Horizontal rule */}
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Horizontal Rule">―</Button>
            
            {/* Undo/Redo */}
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().undo().run()} aria-label="Undo">↺</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().redo().run()} aria-label="Redo">↻</Button>
            
            {/* Help toggle */}
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowHelp((v) => !v)} aria-label="Show formatting help">{showHelp ? 'Hide' : 'Show'} Shortcuts</Button>
          </div>
          {/* Collapsible Help Box */}
          {showHelp && (
            <div className="mb-2 p-2 rounded bg-muted text-xs text-left border border-gray-200">
              <div className="font-semibold mb-1">Formatting Shortcuts</div>
              <ul className="list-disc pl-5 space-y-0.5">
                {formattingShortcuts.map((item) => (
                  <li key={item.label}><span className="font-medium">{item.label}:</span> {item.keys}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <div ref={editorRef} className={`rounded-md min-h-32 text-left tiptap font-sans overflow-hidden max-w-full ${editable ? 'cursor-text bg-white border border-gray-200 p-3' : 'bg-transparent'}`}>
        {/* Bubble Menu - only show when editable and text is selected */}
        {editor && editable && (
          <BubbleMenu 
            editor={editor} 
            tippyOptions={{ duration: 100 }}
            className="flex gap-1 p-2 bg-white border border-gray-200 rounded-md shadow-md"
          >
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-secure-100' : ''}><b>B</b></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-secure-100' : ''}><i>I</i></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-secure-100' : ''}><u>U</u></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-secure-100' : ''}><s>S</s></Button>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
