import { useEffect } from 'react'

import { useThemeStore } from '@/stores/themeStore'

export function useTheme() {
  const { theme, setTheme, resolvedTheme, setResolvedTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function applyTheme() {
      const resolved =
        theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme
      setResolvedTheme(resolved)
      root.classList.toggle('dark', resolved === 'dark')
    }

    applyTheme()
    mediaQuery.addEventListener('change', applyTheme)
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme, setResolvedTheme])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, resolvedTheme, toggleTheme, isDark: resolvedTheme === 'dark' }
}
