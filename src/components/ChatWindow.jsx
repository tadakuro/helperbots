"use client";

import { useState, useRef, useEffect } from "react";
import CharacterSilhouette from "./CharacterSilhouette";
import MessageBox from "./MessageBox";
import ModelToggle from "./ModelToggle";
import ApiKeyModal from "./ApiKeyModal";
import { parseMood } from "@/lib/moodParser";

export default function ChatWindow({ character, username, apiKey, onApiKeyChange }) {
  const [messages, setMessages] = useState([]);
  const [parsedMessages, setParsedMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState(character.defaultMood);
  const [model, setModel] = useState("gpt-5-mini");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const historyRef = useRef(null);

  // Auto-open modal on mount if no key is set
  useEffect(() => {
    if (!apiKey) {
      setModalOpen(true);
    }
  }, []);

  // Reset state when character changes
  useEffect(() => {
    setMessages([]);
    setParsedMessages([]);
    setInputValue("");
    setIsTyping(false);
    setCurrentMood(character.defaultMood);
    setError("");
  }, [character.id]);

  // Scroll history to bottom on new messages
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [parsedMessages, isTyping]);

  const sendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping || !apiKey) return;

    setError("");
    setInputValue("");

    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setParsedMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed, mood: null },
    ]);

    setIsTyping(true);

    try {
      const systemPrompt = character.getSystemPrompt(username);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt,
          model,
          apiKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed.");
      }

      const raw = data.reply ?? "";
      const { mood, text } = parseMood(raw, character.defaultMood);

      const assistantMessage = { role: "assistant", content: raw };
      setMessages((prev) => [...prev, assistantMessage]);
      setParsedMessages((prev) => [
        ...prev,
        { role: "assistant", text, mood },
      ]);
      setCurrentMood(mood);
    } catch (err) {
      console.error("Send message error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const lastAssistant = [...parsedMessages].reverse().find((m) => m.role === "assistant");
  const displayText = isTyping ? "" : (lastAssistant?.text ?? "");
  const displayMood = isTyping ? currentMood : (lastAssistant?.mood ?? character.defaultMood);

  return (
    <div className="chat-window">
      {/* Top bar */}
      <div className="chat-topbar">
        <div className="chat-topbar-left">
          <span className="chat-char-name" style={{ color: character.color }}>
            {character.name}
          </span>
          <span className="chat-char-type">{character.type}</span>
        </div>
        <div className="chat-topbar-right">
          <ModelToggle model={model} onModelChange={setModel} />
          <button
            className={`key-btn ${!apiKey ? "key-btn--missing" : ""}`}
            onClick={() => setModalOpen(true)}
            title={apiKey ? "Update API Key" : "Set API Key"}
          >
            {apiKey ? "🔑 Key" : "⚠️ No Key"}
          </button>
        </div>
      </div>

      {/* Main VN area */}
      <div className="vn-area">
        {/* Chat history scroll */}
        <div className="chat-history" ref={historyRef}>
          {parsedMessages.length === 0 && (
            <div className="chat-empty">
              {apiKey
                ? `Start talking to ${character.name}...`
                : "Set your API key to begin."}
            </div>
          )}
          {parsedMessages.map((msg, i) => (
            <div
              key={i}
              className={`history-line ${msg.role === "user" ? "history-user" : "history-assistant"}`}
            >
              {msg.role === "user" ? (
                <span className="history-user-label">{username}:</span>
              ) : (
                <span
                  className="history-assistant-label"
                  style={{ color: character.color }}
                >
                  {character.name}:
                </span>
              )}
              <span className="history-text">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Silhouette + message box row */}
        <div className="vn-bottom">
          <div className="vn-silhouette">
            <CharacterSilhouette
              silhouetteType={character.silhouetteType}
              color={character.color}
              mood={displayMood}
              moods={character.moods}
            />
          </div>
          <div className="vn-right">
            <MessageBox
              character={character}
              mood={displayMood}
              text={displayText}
              isTyping={isTyping}
            />
            {error && <div className="chat-error">{error}</div>}
            <div className="chat-input-row">
              <input
                className="chat-input"
                type="text"
                placeholder={
                  !apiKey
                    ? "Set your API key first..."
                    : `Say something to ${character.name}...`
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping || !apiKey}
                maxLength={300}
              />
              <button
                className="chat-send-btn"
                onClick={sendMessage}
                disabled={isTyping || !inputValue.trim() || !apiKey}
                style={{ "--char-color": character.color }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onApiKeyChange}
        hasKey={!!apiKey}
      />
    </div>
  );
}
