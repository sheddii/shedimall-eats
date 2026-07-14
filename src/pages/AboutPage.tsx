import hero from "@/assets/hero-about.jpg";
import { Hero } from "@/components/Hero";

export function AboutPage() {
  return (
    <>
      <Hero
        image={hero}
        eyebrow="About us"
        title="A neighborhood kitchen, going online."
        subtitle="Shedi-Mall started as a small family eatery — today we cook the same recipes for a wider table."
      />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 prose prose-neutral">
        <h2 className="font-display text-3xl font-semibold">Our story</h2>
        <p className="text-muted-foreground mt-4">
          Founded in 2019, Shedi-Mall began with three dishes and one goal: honest food, cooked with care. We
          source our produce from local markets each morning and season everything by hand.
        </p>
        <h2 className="font-display text-3xl font-semibold mt-10">What we believe</h2>
        <ul className="mt-4 space-y-3 text-muted-foreground">
          <li>• Every plate should taste like it was made for you.</li>
          <li>• Fair prices, fair sourcing, fair wages.</li>
          <li>• Fast, friendly delivery — no compromise on quality.</li>
        </ul>
      </section>
    </>
  );
}
