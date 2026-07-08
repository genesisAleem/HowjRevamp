import { useRef, useState } from 'react'
import poster from '../assets/hero/montegobay.png'

// Full-bleed ambient background for the hero. Any .mp4/.webm dropped into
// src/assets/hero/videos/ is auto-discovered at build time and played as a
// looping background playlist, in filename order (prefix files 01-, 02-, …
// to control sequence). With no videos present, the static Montego Bay
// image renders as before; it also stays underneath as the loading fallback.
const playlist = Object.entries(
  import.meta.glob('../assets/hero/videos/*.{mp4,webm}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)

export default function HeroBackground({ videos = playlist }) {
  // Two stacked <video> slots double-buffer the playlist: while one plays,
  // the other preloads the next clip, so transitions crossfade without a
  // flash of poster/black between clips.
  const [active, setActive] = useState(0)
  const [indices, setIndices] = useState([0, 1 % Math.max(videos.length, 1)])
  const slotRefs = [useRef(null), useRef(null)]

  const handleEnded = (slot) => {
    if (slot !== active || videos.length < 2) return
    const next = 1 - slot
    slotRefs[next].current?.play()
    setActive(next)
    // the slot that just finished becomes the preload buffer for the clip after
    setIndices((prev) => {
      const updated = [...prev]
      updated[slot] = (prev[next] + 1) % videos.length
      return updated
    })
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <img src={poster} alt="" className="size-full object-cover" />
      {videos.length === 1 && (
        <video
          src={videos[0]}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {videos.length > 1 &&
        [0, 1].map((slot) => (
          <video
            key={slot}
            ref={slotRefs[slot]}
            src={videos[indices[slot]]}
            autoPlay={slot === 0}
            muted
            playsInline
            preload="auto"
            onEnded={() => handleEnded(slot)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
              slot === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      {/* 50% scrim so the white card and mint navbar keep contrast on bright frames */}
      <div className="absolute inset-0 bg-neutral-black/50" />
    </div>
  )
}
