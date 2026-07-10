import { useEffect } from 'react'

/** Keeps the browser tab title in sync (Helmet alone can miss updates in SPA). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (document.title !== title) {
      document.title = title
    }
  }, [title])
}
