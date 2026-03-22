"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { characters } from "@/data/characters";

export default function ChatPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [activeCharId, setActiveCharId] = useState(characters[0].id);

  // Check session auth on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth !== "true") {
      router.replace("/");
    } else {
      setAuthed(true);
    }
  }, []);

  const handleUsernameSubmit = () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) return;
    if (trimmed.length > 24) return;
    setUsername(trimmed);
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter") handleUsernameSubmit();
  };

  const handleCharSelect = (id) => {
    setActiveCharId(id);
  };

  const activeCharacter = characters.find((c) => c.id === activeCharId) ?? characters[0];

  if (!authed) return null;

  // Step 1 — Username
  if (!username) {
    return (
      <main className="gate-page">
        <div className="gate-card">
          <div className="gate-ornament">✦</div>
          <h1 className="gate-title">Who are you?</h1>
          <p className="gate-subtitle">The characters will call you by this name</p>
          <input
            className="gate-input"
            type="text"
            placeholder="Your name"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={handleUsernameKeyDown}
            maxLength={24}
            autoFocus
          />
          <button
            className="gate-btn"
            onClick={handleUsernameSubmit}
            disabled={!usernameInput.trim()}
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  // Step 2 — Main chat (modal handles API key)
  return (
    <main className="app-layout">
      <Sidebar
        characters={characters}
        activeId={activeCharId}
        onSelect={handleCharSelect}
      />
      <ChatWindow
        key={activeCharId}
        character={activeCharacter}
        username={username}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />
    </main>
  );
}
