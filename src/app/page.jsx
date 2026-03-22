"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const trimmed = password.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: trimmed }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store auth in sessionStorage so chat page can verify
        sessionStorage.setItem("auth", "true");
        router.push("/chat");
      } else {
        setError(data.message || "Incorrect password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <main className="gate-page">
      <div className="gate-card">
        <div className="gate-ornament">✦</div>
        <h1 className="gate-title">Enter</h1>
        <p className="gate-subtitle">This space is private</p>
        <input
          className="gate-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {error && <p className="gate-error">{error}</p>}
        <button
          className="gate-btn"
          onClick={handleSubmit}
          disabled={loading || !password.trim()}
        >
          {loading ? "Verifying..." : "Enter"}
        </button>
      </div>
    </main>
  );
}
