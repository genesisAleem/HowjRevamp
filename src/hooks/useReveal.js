import { useEffect, useRef } from 'react'

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Deliberately dependency-free (no GSAP) — the brief only calls for
 * simple fade/slide-in-on-scroll, which IO + CSS transitions handle well.
 * If the design later needs pinning, parallax, or scrubbed timelines,
 * that's the point where pulling in GSAP + ScrollTrigger would earn its keep.
 */
export function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Respect reduced-motion preference — just show content, skip the animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return ref
}
