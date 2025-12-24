import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Heading1, Heading2, Heading3, Quote, Code, Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-white rounded-t-lg flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
      >
        <Bold className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
      >
        <Italic className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
      >
        <Underline className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`h-8 px-2 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`h-8 px-2 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`h-8 px-2 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-100' : ''}`}
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
      >
        <List className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
      >
        <Quote className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('codeBlock') ? 'bg-gray-100' : ''}`}
      >
        <Code className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="h-8 w-8 p-0"
      >
        <Undo className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="h-8 w-8 p-0"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function ScriptEditor({ content, onChange, placeholder = "Start writing your script..." }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6',
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor}
        className="prose-editor"
      />
      <style jsx global>{`
        .prose-editor .ProseMirror {
          outline: none;
          min-height: 500px;
          padding: 1.5rem;
          font-family: 'Courier Prime', monospace;
          font-size: 17px;
          line-height: 1.75;
          color: #1f2937;
        }
        
        .prose-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .prose-editor .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        
        .prose-editor .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        
        .prose-editor .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        
        .prose-editor .ProseMirror ul,
        .prose-editor .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        
        .prose-editor .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
          font-style: italic;
        }
        
        .prose-editor .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.9em;
        }
        
        .prose-editor .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .prose-editor .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        
        .prose-editor .ProseMirror strong {
          font-weight: bold;
        }
        
        .prose-editor .ProseMirror em {
          font-style: italic;
        }
        
        .prose-editor .ProseMirror u {
          text-decoration: underline;
        }
        
        .prose-editor .ProseMirror:focus {
          outline: none;
        }
        
        /* Script-specific formatting */
        .prose-editor .ProseMirror .script-scene-heading {
          font-weight: bold;
          text-transform: uppercase;
          margin: 1.5em 0 1em 0;
        }
        
        .prose-editor .ProseMirror .script-character {
          margin-left: 35%;
          width: 40%;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .prose-editor .ProseMirror .script-parenthetical {
          margin-left: 30%;
          width: 40%;
          font-style: italic;
        }
        
        .prose-editor .ProseMirror .script-dialogue {
          margin-left: 20%;
          width: 60%;
        }
      `}</style>
    </div>
  );
}

