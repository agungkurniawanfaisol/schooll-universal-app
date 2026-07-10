import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
) {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } =
    options
  const ref = useRef<HTMLElement | null>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    const node = ref.current
    if (!node || frozen) return

    const observer = new IntersectionObserver(
      ([observedEntry]) => setEntry(observedEntry),
      { threshold, root, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, root, rootMargin, frozen])

  return { ref, entry, isIntersecting: !!entry?.isIntersecting }
}
