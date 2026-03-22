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
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
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
    if (!trimmed) {
      setUsernameError("Please enter a name.");
      return;
    }
    if (trimmed.length > 24) {
      setUsernameError("Name must be 24 characters or less.");
      return;
    }
    setUsername(trimmed);
  };

  const handleApiKeySubmit = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setApiKeyError("Please enter your API key.");
      return;
    }
    if (!trimmed.startsWith("sk-")) {
      setApiKeyError("Invalid key — OpenAI keys start with sk-");
      return;
    }
    setApiKey(trimmed);
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter") handleUsernameSubmit();
  };

  const handleApiKeyKeyDown = (e) => {
    if (e.key === "Enter") handleApiKeySubmit();
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
          {usernameError && <p className="gate-error">{usernameError}</p>}
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

  // Step 2 — API Key
  if (!apiKey) {
    return (
      <main className="gate-page">
        <div className="gate-card">
          <div className="gate-ornament">✦</div>
          <h1 className="gate-title">API Key</h1>
          <p className="gate-subtitle">Paste your OpenAI API key to begin</p>
          <p className="gate-hint">Your key is only held in memory and never stored</p>
          <input
            className="gate-input"
            type="password"
            placeholder="sk-..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            onKeyDown={handleApiKeyKeyDown}
            autoFocus
          />
          {apiKeyError && <p className="gate-error">{apiKeyError}</p>}
          <button
            className="gate-btn"
            onClick={handleApiKeySubmit}
            disabled={!apiKeyInput.trim()}
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  // Step 3 — Main chat
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
      />
    </main>
  );
}
