"use client";

import { useState, useRef, useEffect } from "react";
import CharacterSilhouette from "./CharacterSilhouette";
import MessageBox from "./MessageBox";
import ModelToggle from "./ModelToggle";
import { parseMood } from "@/lib/moodParser";

export default function ChatWindow({ character, username, apiKey }) {
  const [messages, setMessages] = useState([]); // { role: "user"|"assistant", content: string }
  const [parsedMessages, setParsedMessages] = useState([]); // { role, text, mood }
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState(character.defaultMood);
  const [currentText, setCurrentText] = useState("");
  const [model, setModel] = useState("gpt-5.4-mini");
  const [error, setError] = useState("");
  const historyRef = useRef(null);
  const inputRef = useRef(null);

  // Reset state when character changes
  useEffect(() => {
    setMessages([]);
    setParsedMessages([]);
    setInputValue("");
    setIsTyping(false);
    setCurrentMood(character.defaultMood);
    setCurrentText("");
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
    if (!trimmed || isTyping) return;

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
      setCurrentText(text);
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

  // Show last assistant message in the VN box
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
        <ModelToggle model={model} onModelChange={setModel} />
      </div>

      {/* Main VN area */}
      <div className="vn-area">
        {/* Chat history scroll */}
        <div className="chat-history" ref={historyRef}>
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
                ref={inputRef}
                className="chat-input"
                type="text"
                placeholder={`Say something to ${character.name}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                maxLength={300}
              />
              <button
                className="chat-send-btn"
                onClick={sendMessage}
                disabled={isTyping || !inputValue.trim()}
                style={{ "--char-color": character.color }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
