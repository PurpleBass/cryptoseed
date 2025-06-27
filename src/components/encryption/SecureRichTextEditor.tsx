import React, { useState, useRef, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlignLeft, AlignCenter, AlignRight, List, ChevronDown } from 'lucide-react';
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
  const [preservedSelection, setPreservedSelection] = useState<any>(null);
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

  // Focus editor on click anywhere in the box and handle selection clearing
  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleClick = (event: Event) => {
      if (editor && editable) {
        editor.commands.focus();
        
        // Check if click is outside the current selection area
        const target = event.target as Element;
        if (target && !target.closest('.ProseMirror')) {
          // Clear preserved selection if clicking outside the editor content
          setPreservedSelection(null);
        }
      }
    };

    const handleDocumentClick = (event: Event) => {
      const target = event.target as Element;
      // If clicking outside the editor entirely, clear preserved selection
      if (editorRef.current && !editorRef.current.contains(target)) {
        setPreservedSelection(null);
      }
    };
    
    const ref = editorRef.current;
    ref.addEventListener('click', handleClick);
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      ref.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [editor, editable]);

  // Track selections to preserve them during formatting operations
  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const { selection } = editor.state;
      if (!selection.empty) {
        // Store the current selection for later restoration
        setPreservedSelection({
          from: selection.from,
          to: selection.to,
          content: editor.state.doc.textBetween(selection.from, selection.to)
        });
      }
    };

    // Handle keyboard shortcuts to preserve selection
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const isAlt = event.altKey;
      
      if (isCtrlOrCmd && preservedSelection) {
        const key = event.key.toLowerCase();
        
        // Check for formatting shortcuts that should preserve selection
        const isFormattingShortcut = (
          // Basic formatting
          (key === 'b' && !isShift && !isAlt) || // Bold
          (key === 'i' && !isShift && !isAlt) || // Italic  
          (key === 'u' && !isShift && !isAlt) || // Underline
          (key === 'x' && isShift && !isAlt) || // Strikethrough
          
          // Lists
          (key === '7' && isShift && !isAlt) || // Numbered list
          (key === '8' && isShift && !isAlt) || // Bullet list
          (key === '9' && isShift && !isAlt) || // Task list (Cmd+Shift+9)
          
          // Text alignment
          (key === 'l' && isShift && !isAlt) || // Align left
          (key === 'e' && isShift && !isAlt) || // Align center
          (key === 'r' && isShift && !isAlt) || // Align right
          
          // Horizontal rule
          (key === '-' && isAlt && !isShift) // Horizontal rule (Ctrl/Cmd+Alt+-)
        );
        
        if (isFormattingShortcut) {
          // Schedule selection restoration after the command completes
          // Use a slightly longer delay to ensure the command has fully executed
          setTimeout(() => {
            if (preservedSelection && editor && editor.view.state.selection.empty) {
              // Only restore if selection was actually lost
              editor.commands.setTextSelection({
                from: preservedSelection.from,
                to: preservedSelection.to
              });
            }
          }, 20);
        }
      }
      
      // Clear preserved selection for non-formatting operations like typing
      if (!isCtrlOrCmd && !isAlt && event.key.length === 1) {
        // User is typing regular characters, clear preserved selection
        setPreservedSelection(null);
      }
    };

    editor.on('selectionUpdate', updateSelection);
    
    // Add keyboard event listener to the editor's DOM element
    const editorElement = editor.view.dom;
    editorElement.addEventListener('keydown', handleKeyDown);
    
    return () => {
      editor.off('selectionUpdate', updateSelection);
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, preservedSelection]);

  // Helper function to restore preserved selection
  const restoreSelection = () => {
    if (preservedSelection && editor) {
      // Restore the selection after formatting
      editor.commands.setTextSelection({
        from: preservedSelection.from,
        to: preservedSelection.to
      });
    }
  };

  if (!editor) return null;

  // Helper function to toggle text alignment while preserving selection
  const toggleTextAlign = () => {
    if (editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }))) {
      editor.chain().focus().setTextAlign('center').run();
    } else if (editor.isActive({ textAlign: 'center' })) {
      editor.chain().focus().setTextAlign('right').run();
    } else {
      editor.chain().focus().setTextAlign('left').run();
    }
    // Restore selection after a brief delay
    setTimeout(restoreSelection, 10);
  };

  // Helper function for formatting commands that preserves selection
  const formatWithSelection = (command: () => any) => {
    command();
    // Restore selection after a brief delay to allow the command to complete
    setTimeout(restoreSelection, 10);
  };

  // Get current text alignment icon
  const getAlignmentIcon = () => {
    if (editor.isActive({ textAlign: 'center' })) return <AlignCenter className="h-3.5 w-3.5" />;
    if (editor.isActive({ textAlign: 'right' })) return <AlignRight className="h-3.5 w-3.5" />;
    return <AlignLeft className="h-3.5 w-3.5" />;
  };



  return (
    <div>
      {/* Toolbar - only show when editable */}
      {editable && (
        <>
          <div className="flex flex-wrap gap-1 mb-2">
            {/* Text formatting controls - always visible on the left */}
            <Button type="button" size="sm" variant="outline" onClick={() => formatWithSelection(() => editor.chain().focus().toggleBold().run())} className={editor.isActive('bold') ? 'bg-secure-100' : ''} aria-label="Bold" title="Bold"><b>B</b></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => formatWithSelection(() => editor.chain().focus().toggleItalic().run())} className={editor.isActive('italic') ? 'bg-secure-100' : ''} aria-label="Italic" title="Italic"><i>I</i></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => formatWithSelection(() => editor.chain().focus().toggleUnderline().run())} className={editor.isActive('underline') ? 'bg-secure-100' : ''} aria-label="Underline" title="Underline"><u>U</u></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => formatWithSelection(() => editor.chain().focus().toggleStrike().run())} className={editor.isActive('strike') ? 'bg-secure-100' : ''} aria-label="Strikethrough" title="Strikethrough"><s>S</s></Button>
            
            {/* Text alignment toggle */}
            <Button type="button" size="sm" variant="outline" onClick={toggleTextAlign} aria-label="Text Alignment" title="Text Alignment (Left → Center → Right)" className="flex items-center">
              {getAlignmentIcon()}
            </Button>
            
            {/* Lists dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="sm" variant="outline" className={`flex items-center gap-1 ${(editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList')) ? 'bg-secure-100' : ''}`} title="Lists">
                  <List className="h-3.5 w-3.5" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => formatWithSelection(() => editor.chain().focus().toggleBulletList().run())} className={editor.isActive('bulletList') ? 'bg-secure-50' : ''}>
                  • Bullet List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => formatWithSelection(() => editor.chain().focus().toggleOrderedList().run())} className={editor.isActive('orderedList') ? 'bg-secure-50' : ''}>
                  1. Numbered List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => formatWithSelection(() => editor.chain().focus().toggleTaskList().run())} className={editor.isActive('taskList') ? 'bg-secure-50' : ''}>
                  ☑ Checklist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Separator */}
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Horizontal rule */}
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Horizontal Rule" title="Horizontal Rule">―</Button>
            
            {/* Undo/Redo */}
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().undo().run()} aria-label="Undo" title="Undo">↺</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().redo().run()} aria-label="Redo" title="Redo">↻</Button>
            
            {/* Help toggle */}
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowHelp((v) => !v)} aria-label="Show formatting help">{showHelp ? 'Hide' : 'Show'} Shortcuts</Button>
          </div>
          {/* Collapsible Help Box */}
          {showHelp && (
            <div className="mb-2 p-2 rounded bg-muted text-xs text-left border border-gray-200">
              <div className="font-semibold mb-1">Formatting Shortcuts</div>
              <div className="text-green-700 mb-2 p-1 bg-green-50 rounded text-xs">
                💡 <strong>Tip:</strong> Select text once and apply multiple formats! Your selection stays active with both buttons and keyboard shortcuts until you click elsewhere.
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {formattingShortcuts.map((item) => (
                  <li key={item.label}><span className="font-medium">{item.label}:</span> {item.keys}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <div ref={editorRef} className={`rounded-md min-h-32 text-left tiptap font-sans overflow-hidden max-w-full ${editable ? 'cursor-text bg-white border border-gray-200 p-3' : 'bg-transparent'} ${preservedSelection ? 'ring-1 ring-secure-200' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
