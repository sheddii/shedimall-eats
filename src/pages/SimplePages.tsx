import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 py-20">
      <h1 className="font-display text-3xl font-semibold mb-6">{title}</h1>
      <div className="rounded-xl border border-border bg-card p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function useRedirectTarget() {
  const search = useSearch({ strict: false }) as { redirect?: string };
  return search?.redirect && search.redirect.startsWith("/") ? search.redirect : "/dashboard";
}

export function SignInPage() {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const target = useRedirectTarget();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate({ href: target });
  }, [isAuthenticated, navigate, target]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      navigate({ href: target });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Sign in">
      <form onSubmit={onSubmit}>
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && <p className="text-sm text-destructive mb-3">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          New here? <Link to="/signup" className="text-brand hover:underline">Create an account</Link>
        </p>
      </form>
    </Shell>
  );
}

export function SignUpPage() {
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const target = useRedirectTarget();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: target });
  }, [isAuthenticated, navigate, target]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signUp(name, email, password);
      navigate({ to: target });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Create account">
      <form onSubmit={onSubmit}>
        <Field label="Full name" value={name} onChange={setName} autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
        {error && <p className="text-sm text-destructive mb-3">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground disabled:opacity-60"
        >
          {busy ? "Creating…" : "Sign up"}
        </button>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Already have an account? <Link to="/signin" className="text-brand hover:underline">Sign in</Link>
        </p>
      </form>
    </Shell>
  );
}

export function SettingsPage() {
  const { user, signOut } = useAuth();
  if (user) {
    return (
      <Shell title="Settings">
        <p className="text-sm text-muted-foreground mb-2">Signed in as</p>
        <p className="font-medium mb-6">{user.name} <span className="text-muted-foreground font-normal">({user.email})</span></p>
        <div className="flex gap-2">
          <Link to="/dashboard" className="flex-1 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground text-center">Dashboard</Link>
          <button onClick={signOut} className="flex-1 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent">Sign out</button>
        </div>
      </Shell>
    );
  }
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
