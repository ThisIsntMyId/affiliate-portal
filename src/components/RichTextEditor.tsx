'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
// import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Image from '@tiptap/extension-image'
import Color from '@tiptap/extension-color'
// import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { RichTextToolbar } from './rich-text/RichTextToolbar'
import { Table } from '@tiptap/extension-table'
import { TextStyle } from '@tiptap/extension-text-style'

export type RichTextVariant = 'minimal' | 'full'

export interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  variant?: RichTextVariant
  placeholder?: string
  className?: string
  disabled?: boolean
}

const getExtensions = (variant: RichTextVariant, placeholder?: string) => {
  const baseExtensions = [
    StarterKit.configure({
      // Disable some extensions that we'll add conditionally
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Underline,
    Placeholder.configure({
      placeholder: placeholder || 'Start typing...',
    }),
  ]

  if (variant === 'full') {
    return [
      ...baseExtensions,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ]
  }

  // Minimal variant - only basic extensions
  return [
    ...baseExtensions,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline',
      },
    }),
  ]
}

export function RichTextEditor({
  value = '',
  onChange,
  variant = 'minimal',
  placeholder,
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: getExtensions(variant, placeholder),
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    onSelectionUpdate: () => {
      // Force re-render of toolbar when selection changes
      // This ensures toolbar buttons reflect current selection state
    },
    editorProps: {
      attributes: {
        class: cn(
          'focus:outline-none min-h-[120px] p-4 text-gray-700 leading-relaxed',
          // Headings
          '[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-6',
          '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h2]:mt-5',
          '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:mt-4',
          // Paragraphs
          '[&_p]:mb-4 [&_p]:leading-relaxed',
          // Text formatting
          '[&_strong]:font-semibold [&_strong]:text-gray-900',
          '[&_em]:italic',
          '[&_u]:underline',
          '[&_s]:line-through',
          // Code
          '[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-gray-900',
          '[&_pre]:bg-gray-50 [&_pre]:border [&_pre]:border-gray-200 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-4',
          '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm',
          // Lists
          '[&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc',
          '[&_ol]:mb-4 [&_ol]:pl-6 [&_ol]:list-decimal',
          '[&_li]:mb-1',
          // Blockquotes
          '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:mb-4',
          // Links
          '[&_a]:text-blue-600 [&_a]:no-underline hover:[&_a]:underline',
          // Tables
          '[&_table]:w-full [&_table]:border-collapse [&_table]:mb-4 [&_table]:text-sm [&_table]:border [&_table]:border-gray-200 [&_table]:rounded-lg [&_table]:overflow-hidden',
          '[&_th]:bg-gray-50 [&_th]:font-semibold [&_th]:text-gray-900 [&_th]:border [&_th]:border-gray-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-gray-100',
          '[&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:bg-white',
          '[&_tr:hover_td]:bg-gray-50 [&_tr:hover_th]:bg-gray-100',
          // Images
          '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mb-4',
          disabled && 'opacity-50 cursor-not-allowed'
        ),
      },
    },
  })

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  // const handleChange = useCallback(
  //   (html: string) => {
  //     if (html !== value) {
  //       onChange?.(html)
  //     }
  //   },
  //   [onChange, value]
  // )

  if (!editor) {
    return null
  }

  return (
    <div className={cn('border border-gray-200 rounded-lg bg-white', className)}>
      <RichTextToolbar editor={editor} variant={variant} />
      <div className="border-t border-gray-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
