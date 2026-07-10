import { TooltipProvider } from '@/components/ui/tooltip'
import { useTheme } from '@/hooks/useTheme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useTheme()

  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
}
