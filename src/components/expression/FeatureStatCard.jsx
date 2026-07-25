// Image tile with a stat overlaid at the bottom-left (e.g. "500+ / Total souls
// impacted"). A dark gradient keeps the white text legible over any photo.
export default function FeatureStatCard({ image, value, label }) {
  return (
    <div className="relative flex aspect-[341/419] w-full flex-col justify-end overflow-hidden rounded-md">
      <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="relative flex flex-col gap-xs p-md text-neutral-white">
        <p className="font-condensed text-7xl font-bold leading-[1] sm:text-8xl">{value}</p>
        <p className="text-lg leading-snug">{label}</p>
      </div>
    </div>
  )
}
