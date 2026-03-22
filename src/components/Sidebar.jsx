"use client";

export default function Sidebar({ characters, activeId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Characters</div>
      <nav className="sidebar-list">
        {characters.map((char) => (
          <button
            key={char.id}
            className={`sidebar-item ${activeId === char.id ? "active" : ""}`}
            style={{
              "--char-color": char.color,
            }}
            onClick={() => onSelect(char.id)}
          >
            <span
              className="sidebar-dot"
              style={{ backgroundColor: char.color }}
            />
            <span className="sidebar-info">
              <span className="sidebar-name">{char.name}</span>
              <span className="sidebar-type">{char.type}</span>
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
