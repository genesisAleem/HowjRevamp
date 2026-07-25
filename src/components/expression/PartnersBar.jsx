// "Our Partners in {place}" label beside the partner logos (Figma 181:5671).
// Real logo images come from the CMS; clean circular slots stand in meanwhile.
export default function PartnersBar({ partners }) {
  return (
    <section className="mx-auto flex max-w-[90rem] flex-col items-start gap-md px-6 py-xl sm:flex-row sm:items-center lg:px-4xl">
      <p className="max-w-[10rem] font-body text-2xl leading-snug text-neutral-black">
        {partners.label}
      </p>
      <div className="flex items-center gap-md">
        {partners.logos.map((logo, i) =>
          logo.image ? (
            <img key={i} src={logo.image} alt={logo.name} className="size-32 object-contain" />
          ) : (
            <div
              key={i}
              className="flex size-32 items-center justify-center rounded-full border border-neutral-gray-300 bg-neutral-gray-100 px-sm text-center text-xs text-neutral-gray-500"
            >
              {logo.name}
            </div>
          ),
        )}
      </div>
    </section>
  )
}
