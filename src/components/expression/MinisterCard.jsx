// Portrait tile with the minister's name overlaid at the bottom.
export default function MinisterCard({ name, image }) {
  return (
    <div className="relative flex aspect-[385/481] w-full flex-col justify-end overflow-hidden rounded-md">
      <img src={image} alt={name} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <p className="relative px-lg py-md font-condensed text-3xl font-bold text-neutral-white">{name}</p>
    </div>
  )
}
