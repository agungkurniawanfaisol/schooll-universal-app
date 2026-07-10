import { Bold, Heading2, Italic, Link2, List, ListOrdered } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis konten...',
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = editorRef.current
    if (!el || el.innerHTML === value) return
    el.innerHTML = value
  }, [value])

  const exec = useCallback((command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML ?? '')
  }, [onChange])

  const addLink = () => {
    const url = window.prompt('URL tautan', 'https://')
    if (url) exec('createLink', url)
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border', className)}>
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-2">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('formatBlock', 'h2')}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addLink}>
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        className="prose prose-neutral dark:prose-invert min-h-[200px] max-w-none px-4 py-3 text-sm focus:outline-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
        suppressContentEditableWarning
      />
    </div>
  )
}
