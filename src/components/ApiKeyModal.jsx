"use client";

import { useState, useEffect } from "react";

export default function ApiKeyModal({ isOpen, onClose, onSave, hasKey }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Reset input when modal opens
  useEffect(() => {
    if (isOpen) {
      setInput("");
      setError("");
    }
  }, [isOpen]);

  const handleSave = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter your API key.");
      return;
    }
    if (!trimmed.startsWith("sk-")) {
      setError("Invalid key — OpenAI keys start with sk-");
      return;
    }
    onSave(trimmed);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape" && hasKey) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={hasKey ? onClose : undefined}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="gate-ornament">✦</div>
        <h2 className="modal-title">
          {hasKey ? "Update API Key" : "Enter API Key"}
        </h2>
        <p className="gate-subtitle">Paste your OpenAI API key to continue</p>
        <p className="gate-hint">Held in memory only — never stored anywhere</p>
        <input
          className="gate-input"
          type="password"
          placeholder="sk-..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {error && <p className="gate-error">{error}</p>}
        <div className="modal-actions">
          {hasKey && (
            <button className="modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          )}
          <button
            className="gate-btn"
            onClick={handleSave}
            disabled={!input.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
