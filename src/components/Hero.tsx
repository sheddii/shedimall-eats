type Props = { image: string; eyebrow?: string; title: string; subtitle?: string };

export function Hero({ image, eyebrow, title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[52vh] min-h-[360px] w-full">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-end pb-12">
          <div className="max-w-2xl text-white">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-3">{eyebrow}</p>
            )}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold">{title}</h1>
            {subtitle && <p className="mt-4 text-white/85 text-base sm:text-lg max-w-xl">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
