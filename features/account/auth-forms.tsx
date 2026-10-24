"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { loginWithPassword, registerAccount } from "@/features/account/auth-api";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { cn } from "@/lib/cn";

function nextPath(search: ReturnType<typeof useSearchParams>, fallback: string) {
  const value = search.get("next");
  if (value && value.startsWith("/")) return value;
  return fallback;
}

export function LoginForm({ admin = false }: { admin?: boolean }) {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginWithPassword(email, password, admin);
      router.push(nextPath(search, admin ? "/admin" : "/account"));
    } catch (err) {
      setError(errorMessage(err, "Could not sign in."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className={cn("mx-auto space-y-4", admin ? "mt-8 max-w-none px-0 pb-0" : "max-w-md px-6 pb-24")}
    >
      <Field label="Email">
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </Field>
      <Field label="Password">
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </Field>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <Button type="submit" className="w-full rounded-lg" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      {!admin ? (
        <p className="text-center text-sm text-muted">
          <Link href="/forgot-password">Forgot password</Link>
          {" · "}
          <Link href="/register">Create an account</Link>
        </p>
      ) : null}
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await registerAccount(form);
      router.push("/account");
    } catch (err) {
      setError(errorMessage(err, "Could not create the account."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-md gap-4 px-6 pb-24">
      <Field label="First name">
        <Input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
      </Field>
      <Field label="Last name">
        <Input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
      </Field>
      <Field label="Email">
        <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <Field label="Phone">
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </Field>
      <Field label="Password">
        <Input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </Field>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Creating…" : "Create account"}
      </Button>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/forgot-password/", { email }, { auth: false });
      setMessage("If that email exists, a reset link is on its way.");
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 px-6 pb-24">
      <Field label="Email">
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Button type="submit" disabled={busy}>
        Send reset link
      </Button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}

export function ResetForm() {
  const search = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.post(
        "/auth/reset-password/",
        {
          token: search.get("token"),
          uid: search.get("uid"),
          password,
          new_password: password,
        },
        { auth: false },
      );
      setMessage("Password updated. You can sign in.");
      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      setMessage(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!search.get("token") && !search.get("uid")) {
    return <p className="px-6 text-center text-muted">This reset link is missing a token.</p>;
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 px-6 pb-24">
      <Field label="New password">
        <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Button type="submit" disabled={busy}>
        Update password
      </Button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}
