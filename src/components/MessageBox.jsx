"use client";

export default function MessageBox({ character, mood, text, isTyping }) {
  const moodData = character?.moods?.[mood] ?? { label: mood, glow: character?.color };

  return (
    <div
      className="message-box"
      style={{ "--char-color": character?.color ?? "#888" }}
    >
      <div className="message-box-header">
        <span
          className="message-box-name"
          style={{ color: character?.color }}
        >
          {character?.name ?? ""}
        </span>
        <span
          className="message-box-mood"
          style={{ color: moodData.glow }}
        >
          {moodData.label}
        </span>
      </div>
      <div className="message-box-text">
        {isTyping ? (
          <span className="typing-indicator">
            <span />
            <span />
            <span />
          </span>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
