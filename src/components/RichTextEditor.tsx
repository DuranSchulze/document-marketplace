'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

/**
 * Rich-text editor used in the admin DocumentForm.
 *
 * Outputs HTML (via `editor.getHTML()`) so the value can be stored as-is in
 * the existing `Document.description String` column and rendered through the
 * server-side `sanitizeRichText()` helper on the public detail page.
 *
 * SSR note: `immediatelyRender: false` is required in the Next.js App Router
 * to avoid a hydration mismatch — TipTap otherwise renders synchronously
 * during SSR with a different output than the client hydration pass.
 */
export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Restrict heading levels to keep author output predictable on the
        // public page (the title already uses h1).
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
          class: 'text-[var(--lagoon-deep)] underline',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Describe what this document contains and who it's for…",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[180px] p-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Keep the editor in sync if the parent resets `value` (e.g. on form load
  // for the edit page). Don't re-set on every render — only when the prop
  // genuinely diverges from the current editor content.
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
    // We intentionally exclude `editor` from deps to avoid a re-set loop;
    // useEditor's identity is stable for the lifetime of the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!editor) {
    return (
      <div className="min-h-[220px] rounded-md border border-input bg-[var(--admin-table-head)] animate-pulse" />
    )
  }

  return (
    <div className="admin-field rounded-md border border-input bg-[var(--admin-panel-strong)] focus-within:ring-2 focus-within:ring-ring/40 transition">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Toolbar
// ───────────────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input px-2 py-1.5 bg-[var(--admin-table-head)]">
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        H3
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Cmd/Ctrl+B)"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Cmd/Ctrl+I)"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bulleted list"
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        ❝
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        active={editor.isActive('link')}
        onClick={() => {
          // Re-prompt with the current URL pre-filled so editors can fix typos
          // instead of having to unset + relink.
          const previous = editor.getAttributes('link').href as string | undefined
          const url = window.prompt('URL (leave blank to remove)', previous ?? 'https://')
          if (url === null) return // cancelled
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }}
        title="Link"
      >
        🔗
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Clear formatting"
      >
        ✕ Clear
      </ToolbarButton>
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={!!active}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        active
          ? 'bg-[var(--admin-row-hover)] text-[var(--admin-link)]'
          : 'admin-muted hover:bg-[var(--admin-row-hover)] hover:text-[var(--admin-text)]'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-[var(--admin-border-soft)]" />
}
