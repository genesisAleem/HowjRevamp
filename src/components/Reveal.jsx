import { useReveal } from '../hooks/useReveal.js'

/**
 * Wrap any block of content to fade/slide it in as it enters the viewport.
 * Usage: <Reveal><h2>Heading</h2></Reveal>
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
