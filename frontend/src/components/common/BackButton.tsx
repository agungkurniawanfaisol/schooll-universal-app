import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  /** Fallback route when browser history is empty */
  to?: string
  label?: string
  /** Custom handler (e.g. close modal) — takes priority over navigation */
  onBack?: () => void
  className?: string
  variant?: 'ghost' | 'outline' | 'gradient'
  size?: 'sm' | 'default'
}

export function BackButton({
  to = '/',
  label = 'Kembali',
  onBack,
  className,
  variant = 'ghost',
  size = 'sm',
}: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onBack) {
      onBack()
      return
    }

    const idx = window.history.state?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
      return
    }

    navigate(to)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn('gap-1.5', size === 'sm' && '-ml-2', className)}
      onClick={handleClick}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}
