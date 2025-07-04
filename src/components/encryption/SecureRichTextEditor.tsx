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
  const [isMobile, setIsMobile] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport for touch-optimized UI
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        types: ['paragraph', 'listItem'],
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
    onFocus: () => {
      setIsEditorFocused(true);
    },
    onBlur: () => {
      setIsEditorFocused(false);
    },
    onSelectionUpdate: ({ editor }) => {
      // Update selection state for toolbar visibility
      const { selection } = editor.state;
      setHasSelection(!selection.empty);
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

  if (!editor) return null;

  // Helper function to toggle text alignment while preserving selection
  const toggleTextAlign = () => {
    if (!editor) return;
    
    // Force focus first to ensure the editor is active
    editor.commands.focus();
    
    // Cycle through left -> center -> right -> left
    if (editor.isActive({ textAlign: 'center' })) {
      editor.chain().focus().setTextAlign('right').run();
    } else if (editor.isActive({ textAlign: 'right' })) {
      editor.chain().focus().setTextAlign('left').run();
    } else {
      editor.chain().focus().setTextAlign('center').run();
    }
  };

  // Helper function for formatting commands that preserves selection
  const formatWithSelection = (command: () => any) => {
    if (!editor) return;
    
    // Ensure editor is focused first
    editor.commands.focus();
    command();
  };

  // Helper function for list commands that ensures proper focus
  const handleListCommand = (listType: 'bulletList' | 'orderedList' | 'taskList') => {
    if (!editor) return;
    
    // Force focus and then toggle the list
    editor.commands.focus();
    
    switch (listType) {
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'taskList':
        editor.chain().focus().toggleTaskList().run();
        break;
    }
  };

  // Get current text alignment icon (depends on updateTrigger for re-rendering)
  const getAlignmentIcon = () => {
    if (!editor) return <AlignLeft className="h-3.5 w-3.5" />;
    
    // Use isActive method as recommended in Tiptap docs
    if (editor.isActive({ textAlign: 'center' })) return <AlignCenter className="h-3.5 w-3.5" />;
    if (editor.isActive({ textAlign: 'right' })) return <AlignRight className="h-3.5 w-3.5" />;
    return <AlignLeft className="h-3.5 w-3.5" />;
  };



  return (
    <div className="modern-editor-container">
      {/* Contextual Toolbar - only show when editor is focused or has selection */}
      {editable && (isEditorFocused || hasSelection) && (
        <>
          <div className="editor-toolbar">
            {/* Mobile-optimized toolbar layout */}
            <div className="toolbar-row">
              {/* Essential formatting group */}
              <div className="toolbar-group">
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline" 
                  onClick={() => formatWithSelection(() => editor.chain().focus().toggleBold().run())} 
                  className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
                  aria-label="Bold" 
                  title="Bold (Ctrl+B)"
                >
                  <b className="text-sm">B</b>
                </Button>
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline" 
                  onClick={() => formatWithSelection(() => editor.chain().focus().toggleItalic().run())} 
                  className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
                  aria-label="Italic" 
                  title="Italic (Ctrl+I)"
                >
                  <i className="text-sm">I</i>
                </Button>
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline" 
                  onClick={() => formatWithSelection(() => editor.chain().focus().toggleUnderline().run())} 
                  className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
                  aria-label="Underline" 
                  title="Underline (Ctrl+U)"
                >
                  <u className="text-sm">U</u>
                </Button>
                {!isMobile && (
                  <Button 
                    type="button" 
                    size="sm"
                    variant="outline" 
                    onClick={() => formatWithSelection(() => editor.chain().focus().toggleStrike().run())} 
                    className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
                    aria-label="Strikethrough" 
                    title="Strikethrough (Ctrl+Shift+X)"
                  >
                    <s className="text-sm">S</s>
                  </Button>
                )}
              </div>
              
              {/* Text alignment - compact on mobile */}
              <div className="toolbar-group">
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline" 
                  onClick={toggleTextAlign} 
                  className="toolbar-btn"
                  aria-label="Text Alignment" 
                  title="Text Alignment (Left → Center → Right)"
                >
                  {getAlignmentIcon()}
                </Button>
              </div>
              
              {/* Lists dropdown - more compact on mobile */}
              <div className="toolbar-group">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="outline" 
                      className={`toolbar-btn ${(editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList')) ? 'active' : ''}`}
                      title="Lists"
                    >
                      <List className="h-3.5 w-3.5" />
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[160px]">
                    <DropdownMenuItem 
                      onClick={() => handleListCommand('bulletList')} 
                      className={editor.isActive('bulletList') ? 'bg-secure-50' : ''}
                    >
                      <span className="mr-2">•</span> Bullet List
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleListCommand('orderedList')} 
                      className={editor.isActive('orderedList') ? 'bg-secure-50' : ''}
                    >
                      <span className="mr-2">1.</span> Numbered List
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleListCommand('taskList')} 
                      className={editor.isActive('taskList') ? 'bg-secure-50' : ''}
                    >
                      <span className="mr-2">☑</span> Checklist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Desktop-only actions */}
              {!isMobile && (
                <div className="toolbar-group">
                  <Button 
                    type="button" 
                    size="sm"
                    variant="outline" 
                    onClick={() => editor.chain().focus().setHorizontalRule().run()} 
                    className="toolbar-btn"
                    aria-label="Horizontal Rule" 
                    title="Horizontal Rule"
                  >
                    ―
                  </Button>
                  <Button 
                    type="button" 
                    size="sm"
                    variant="outline" 
                    onClick={() => editor.chain().focus().undo().run()} 
                    className="toolbar-btn"
                    aria-label="Undo" 
                    title="Undo (Ctrl+Z)"
                  >
                    ↺
                  </Button>
                  <Button 
                    type="button" 
                    size="sm"
                    variant="outline" 
                    onClick={() => editor.chain().focus().redo().run()} 
                    className="toolbar-btn"
                    aria-label="Redo" 
                    title="Redo (Ctrl+Y)"
                  >
                    ↻
                  </Button>
                </div>
              )}
              
              {/* Help toggle - desktop only */}
              {!isMobile && (
                <div className="toolbar-group ml-auto">
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowHelp((v) => !v)} 
                    className="text-xs text-gray-600 hover:text-gray-800"
                    aria-label="Show formatting help"
                  >
                    {showHelp ? 'Hide' : 'Show'} Shortcuts
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Collapsible Help Box */}
          {showHelp && (
            <div className="editor-help">
              <div className="font-semibold mb-2 text-gray-800">Formatting Shortcuts</div>
              <div className="help-tip">
                <strong>Tip:</strong> Select text once and apply multiple formats! Your selection stays active with both buttons and keyboard shortcuts until you click elsewhere.
              </div>
              <div className="shortcuts-grid">
                {formattingShortcuts.map((item) => (
                  <div key={item.label} className="shortcut-item">
                    <span className="shortcut-label">{item.label}:</span>
                    <span className="shortcut-keys">{item.keys}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Modern Editor Container */}
      <div 
        ref={editorRef} 
        className={`modern-editor ${editable ? 'editable' : 'readonly'} ${hasSelection ? 'has-selection' : ''} ${isEditorFocused ? 'focused' : ''}`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
