import { ImagePlus, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  UPLOAD_ACCEPT,
  UPLOAD_HINT,
  UPLOAD_MAX_SIZE_MB,
  isAllowedUploadFile,
} from '@/config/upload'
import { cn } from '@/lib/utils'

export interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onUpload?: (file: File) => Promise<string>
  accept?: string
  maxSizeMB?: number
  className?: string
  label?: string
  variant?: 'default' | 'logo'
}

export function ImageUploader({
  value,
  onChange,
  onUpload,
  accept = UPLOAD_ACCEPT,
  maxSizeMB = UPLOAD_MAX_SIZE_MB,
  className,
  label = 'Upload gambar',
  variant = 'default',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxBytes = maxSizeMB * 1024 * 1024

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      if (!isAllowedUploadFile(file)) {
        setError('Format tidak didukung. Gunakan JPG, PNG, atau WEBP.')
        return
      }

      if (file.size > maxBytes) {
        setError(`Ukuran maksimal ${maxSizeMB}MB`)
        return
      }

      if (onUpload) {
        setUploading(true)
        try {
          const url = await onUpload(file)
          onChange(url)
        } catch {
          setError('Gagal mengupload gambar')
        } finally {
          setUploading(false)
        }
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          onChange(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [maxBytes, maxSizeMB, onChange, onUpload],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) void handleFile(file)
    },
    [handleFile],
  )

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img
            src={value}
            alt="Preview"
            className={cn(
              'w-full',
              variant === 'logo'
                ? 'aspect-square max-h-48 bg-muted/30 object-contain p-4'
                : 'aspect-video object-cover',
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
          )}
        >
          {uploading ? (
            <Upload className="h-10 w-10 animate-pulse text-muted-foreground" />
          ) : (
            <ImagePlus className="h-10 w-10 text-muted-foreground" />
          )}
          <p className="mt-3 text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{UPLOAD_HINT}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
