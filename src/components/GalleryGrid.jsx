import Reveal from './Reveal.jsx'
import photos from '../content/gallery.json'

export default function GalleryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo, i) => (
        <Reveal key={photo.src} delay={(i % 8) * 60} className="overflow-hidden rounded-lg bg-neutral-black/5">
          <img
            src={import.meta.env.BASE_URL + photo.src.replace(/^\//, '')}
            alt={photo.alt}
            loading="lazy"
            className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
          />
        </Reveal>
      ))}
    </div>
  )
}
