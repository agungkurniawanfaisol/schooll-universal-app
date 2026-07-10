import { ImageUploader } from '@/components/common/ImageUploader'
import { uploadLogoFile } from '@/hooks/useMediaUpload'

interface LogoUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  onUpload?: (file: File) => Promise<string>
  className?: string
}

export function LogoUploader({
  label = 'Upload logo',
  onUpload = uploadLogoFile,
  ...props
}: LogoUploaderProps) {
  return (
    <ImageUploader
      {...props}
      variant="logo"
      label={label}
      onUpload={onUpload}
    />
  )
}
