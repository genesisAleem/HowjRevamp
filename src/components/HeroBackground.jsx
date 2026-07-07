import poster from '../assets/hero/montegobay.png'

// Full-bleed ambient background for the hero. Renders the static Montego Bay image
// until a background video file exists — pass `videoSrc` and the image becomes the
// poster/mobile fallback, per the Figma component notes.
export default function HeroBackground({ videoSrc }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {videoSrc ? (
        <video autoPlay loop muted playsInline poster={poster} className="size-full object-cover">
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img src={poster} alt="" className="size-full object-cover" />
      )}
      {/* subtle scrim so the white card and mint navbar keep contrast on bright frames */}
      <div className="absolute inset-0 bg-neutral-black/10" />
    </div>
  )
}
