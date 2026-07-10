import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'
import { queryClient } from '@/api/queryClient'
import { router } from '@/routes'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
