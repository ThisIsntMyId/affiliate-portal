'use client'

import { useState } from 'react'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

const sampleContent = `
<h1>Welcome to the Rich Text Editor</h1>
<p>This is a <strong>powerful</strong> and <em>flexible</em> rich text editor built with <code>Tiptap</code> and <u>Tailwind CSS</u>.</p>
<h2>Features</h2>
<ul>
  <li>Minimal and Full variants</li>
  <li>HTML input/output</li>
  <li>Beautiful prose styling</li>
  <li>Responsive design</li>
</ul>
<p>Try editing this content and see the HTML output below!</p>
`

export default function RichTextEditorDemo() {
  const [minimalContent, setMinimalContent] = useState('')
  const [fullContent, setFullContent] = useState(sampleContent)

  const handleMinimalChange = (html: string) => {
    setMinimalContent(html)
  }

  const handleFullChange = (html: string) => {
    setFullContent(html)
  }

  const loadSampleContent = () => {
    setMinimalContent(sampleContent)
    setFullContent(sampleContent)
  }

  const clearContent = () => {
    setMinimalContent('')
    setFullContent('')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Rich Text Editor Demo</h1>
        <p className="text-lg text-muted-foreground">
          A minimal and full-featured rich text editor built with Tiptap
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={loadSampleContent} variant="outline">
            Load Sample Content
          </Button>
          <Button onClick={clearContent} variant="outline">
            Clear Content
          </Button>
        </div>
      </div>

      <Tabs defaultValue="minimal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="minimal">Minimal Variant</TabsTrigger>
          <TabsTrigger value="full">Full Variant</TabsTrigger>
        </TabsList>

        <TabsContent value="minimal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Minimal Variant
                <Badge variant="secondary">Lightweight</Badge>
              </CardTitle>
              <CardDescription>
                Perfect for comments and basic text formatting. Includes: Text styles, Bold, Italic, Underline, Code, Strike, and Links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={minimalContent}
                onChange={handleMinimalChange}
                variant="minimal"
                placeholder="Start typing your comment here..."
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HTML Output (Minimal)</CardTitle>
              <CardDescription>
                The HTML content that would be saved to your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{minimalContent || '<p>No content yet...</p>'}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Full Variant
                <Badge variant="default">Feature Rich</Badge>
              </CardTitle>
              <CardDescription>
                Complete rich text editing experience. Includes: All minimal features plus lists, alignment, images, tables, quotes, and code blocks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={fullContent}
                onChange={handleFullChange}
                variant="full"
                placeholder="Start writing your content here..."
                className="min-h-[300px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HTML Output (Full)</CardTitle>
              <CardDescription>
                The HTML content that would be saved to your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{fullContent || '<p>No content yet...</p>'}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
          <CardDescription>
            How to use the RichTextEditor component in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`import { RichTextEditor } from '@/components/RichTextEditor'

function MyComponent() {
  const [content, setContent] = useState('')
  
  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      variant="minimal" // or "full"
      placeholder="Start typing..."
      className="min-h-[200px]"
    />
  )
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
