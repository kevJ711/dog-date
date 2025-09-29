"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = e.currentTarget as HTMLFormElement & {
      username: { value: string };
      password: { value: string };
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.username.value, password: form.password.value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Login failed");
        setSubmitting(false);
        return;
      }
      // HttpOnly cookie set by server
      router.push("/");
    } catch {
      alert("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="bg-black w-full min-h-screen flex justify-center items-center;">
        <div className="bg-white w-[500px] p-8 rounded shadow-lg;">
          <h1 className="text-black text-2xl font-mono;" >Log In</h1>
          <form onSubmit={onSubmit}>
            <label htmlFor="username" >Username</label><br />
            <input className="box" id="username" name="username" type="text" /><br />
            <label htmlFor="password" >Password</label><br />
            <input className="box" id="password" name="password" type="password" /><br />
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}