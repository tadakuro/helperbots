"use client";

const MODELS = [
  { id: "gpt-5-mini", label: "Mini", desc: "Better quality" },
  { id: "gpt-5-nano", label: "Nano", desc: "Save tokens" },
];

export default function ModelToggle({ model, onModelChange }) {
  return (
    <div className="model-toggle">
      {MODELS.map((m) => (
        <button
          key={m.id}
          className={`model-btn ${model === m.id ? "active" : ""}`}
          onClick={() => onModelChange(m.id)}
          title={m.desc}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
