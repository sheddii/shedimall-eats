import { Link } from "@tanstack/react-router";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 py-20">
      <h1 className="font-display text-3xl font-semibold mb-6">{title}</h1>
      <div className="rounded-xl border border-border bg-card p-6">{children}</div>
    </section>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input type={type} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

export function SignInPage() {
  return (
    <Shell title="Sign in">
      <form onSubmit={(e) => e.preventDefault()}>
        <Field label="Email" type="email" />
        <Field label="Password" type="password" />
        <button className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground">Sign in</button>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          New here? <Link to="/signup" className="text-brand hover:underline">Create an account</Link>
        </p>
      </form>
    </Shell>
  );
}

export function SignUpPage() {
  return (
    <Shell title="Create account">
      <form onSubmit={(e) => e.preventDefault()}>
        <Field label="Full name" />
        <Field label="Email" type="email" />
        <Field label="Password" type="password" />
        <button className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground">Sign up</button>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Already have an account? <Link to="/signin" className="text-brand hover:underline">Sign in</Link>
        </p>
      </form>
    </Shell>
  );
}

export function SettingsPage() {
  return (
    <Shell title="Settings">
      <p className="text-sm text-muted-foreground mb-6">
        Sign in to manage your profile, delivery addresses, and notifications.
      </p>
      <div className="flex gap-2">
        <Link to="/signin" className="flex-1 rounded-md border border-input px-4 py-2 text-sm font-medium text-center hover:bg-accent">Sign in</Link>
        <Link to="/signup" className="flex-1 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground text-center">Sign up</Link>
      </div>
    </Shell>
  );
}
