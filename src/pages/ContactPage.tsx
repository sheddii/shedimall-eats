import { useState, type FormEvent } from "react";
import hero from "@/assets/hero-contact.jpg";
import { Hero } from "@/components/Hero";

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <>
      <Hero image={hero} eyebrow="Contact" title="Say hello." subtitle="We usually reply within a few hours." />
      <section className="mx-auto max-w-xl px-4 sm:px-6 py-16">
        {sent && (
          <div className="mb-6 rounded-lg border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-foreground">
            Thanks — your message is on its way. We'll be in touch shortly.
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="name">Name</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="message">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground hover:opacity-90 transition-opacity"
          >
            Submit
          </button>
        </form>
      </section>
    </>
  );
}
