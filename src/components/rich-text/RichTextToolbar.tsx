'use client'

import { Editor } from '@tiptap/react'
import { RichTextVariant } from '../RichTextEditor'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarDropdown } from './ToolbarDropdown'
import { ToolbarSeparator } from './ToolbarSeparator'
import { ToolbarGroup } from './ToolbarGroup'
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Quote, 
  Code2,
  Link,
  Image,
  Table,
  Download
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface RichTextToolbarProps {
  editor: Editor
  variant: RichTextVariant
}

export function RichTextToolbar({ editor, variant }: RichTextToolbarProps) {
  const [, forceUpdate] = useState({})
  
  useEffect(() => {
    if (!editor) return

    const updateToolbar = () => {
      forceUpdate({})
    }

    // Listen to editor events that should update the toolbar
    editor.on('selectionUpdate', updateToolbar)
    editor.on('transaction', updateToolbar)
    editor.on('update', updateToolbar)
    editor.on('focus', updateToolbar)
    editor.on('blur', updateToolbar)

    return () => {
      editor.off('selectionUpdate', updateToolbar)
      editor.off('transaction', updateToolbar)
      editor.off('update', updateToolbar)
      editor.off('focus', updateToolbar)
      editor.off('blur', updateToolbar)
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      {/* Text Styles Dropdown */}
      <ToolbarDropdown
        trigger={
          editor.isActive('heading', { level: 1 }) ? 'H1' :
          editor.isActive('heading', { level: 2 }) ? 'H2' :
          editor.isActive('heading', { level: 3 }) ? 'H3' :
          'Normal'
        }
        items={[
          {
            label: 'Normal',
            onClick: () => editor.chain().focus().setParagraph().run(),
            isActive: editor.isActive('paragraph'),
          },
          {
            label: 'Heading 1',
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive('heading', { level: 1 }),
          },
          {
            label: 'Heading 2',
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
          },
          {
            label: 'Heading 3',
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive('heading', { level: 3 }),
          },
        ]}
      />

      <ToolbarSeparator />

      {/* Formatting Group */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <span className="font-bold text-sm">B</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <span className="italic text-sm">I</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
        >
          <span className="underline text-sm">U</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        >
          <Code2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <span className="line-through text-sm">S</span>
        </ToolbarButton>
      </ToolbarGroup>

      {/* Full variant features */}
      {variant === 'full' && (
        <>
          <ToolbarSeparator />

          {/* List Group */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
            >
              <List className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarSeparator />

          {/* Alignment Group */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarSeparator />

          {/* Content Group */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => {
                const url = window.prompt('Enter URL:')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              isActive={editor.isActive('link')}
            >
              <Link className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {
                const url = window.prompt('Enter image URL:')
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run()
                }
              }}
            >
              <Image className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            >
              <Table className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
            >
              <Code2 className="w-4 h-4" />
            </ToolbarButton>
          </ToolbarGroup>
        </>
      )}

      {/* Link for minimal variant */}
      {variant === 'minimal' && (
        <>
          <ToolbarSeparator />
          <ToolbarButton
            onClick={() => {
              const url = window.prompt('Enter URL:')
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            isActive={editor.isActive('link')}
          >
            <Link className="w-4 h-4" />
          </ToolbarButton>
        </>
      )}
    </div>
  )
}
