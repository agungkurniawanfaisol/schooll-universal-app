import { ImagePlus, Loader2, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  UPLOAD_ACCEPT,
  UPLOAD_HINT,
  UPLOAD_MAX_ALBUM_ITEMS,
  UPLOAD_MAX_SIZE_MB,
  isAllowedUploadFile,
} from '@/config/upload'
import { cn } from '@/lib/utils'

interface MultiImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  onUpload: (file: File) => Promise<string>
  maxItems?: number
  className?: string
  label?: string
}

export function MultiImageUploader({
  value,
  onChange,
  onUpload,
  maxItems = UPLOAD_MAX_ALBUM_ITEMS,
  className,
  label = 'Upload foto album',
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxBytes = UPLOAD_MAX_SIZE_MB * 1024 * 1024
  const canAddMore = value.length < maxItems

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null)
      const list = Array.from(files)
      const remaining = maxItems - value.length

      if (remaining <= 0) {
        setError(`Maksimal ${maxItems} foto`)
        return
      }

      const toUpload = list.slice(0, remaining)
      setUploading(true)

      try {
        const urls: string[] = []
        for (const file of toUpload) {
          if (!isAllowedUploadFile(file)) {
            setError('Format tidak didukung. Gunakan JPG, PNG, atau WEBP.')
            continue
          }
          if (file.size > maxBytes) {
            setError(`Ukuran maksimal ${UPLOAD_MAX_SIZE_MB}MB per foto`)
            continue
          }
          const url = await onUpload(file)
          urls.push(url)
        }
        if (urls.length) {
          onChange([...value, ...urls])
        }
      } catch {
        setError('Gagal mengupload gambar')
      } finally {
        setUploading(false)
      }
    },
    [maxBytes, maxItems, onChange, onUpload, value],
  )

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('space-y-3', className)}>
      {value.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-border">
              <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={() => removeAt(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {canAddMore ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 transition-colors',
            uploading
              ? 'border-primary/50 bg-muted/30'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="mt-2 text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {UPLOAD_HINT} · {value.length}/{maxItems} foto
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Batas {maxItems} foto tercapai.</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
