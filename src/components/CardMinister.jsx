// Single minister portrait card — rounded, cropped to a portrait aspect.
// Used standalone and inside the MinistersSection vertical marquee.
export default function CardMinister({ photo, name }) {
  return (
    <div className="overflow-hidden rounded-lg bg-neutral-white/5">
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="aspect-[3/4] w-full object-cover"
      />
    </div>
  )
}
