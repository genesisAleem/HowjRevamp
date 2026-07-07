import Reveal from '../components/Reveal.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'

export default function Gallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal as="h1" className="font-heading text-4xl font-semibold">
        Gallery
      </Reveal>
      <div className="mt-10">
        <GalleryGrid />
      </div>
    </section>
  )
}
