import { useState, useRef, useEffect } from "react";

export default function TopicItem({
  topic,
  isActive,
  onSelect,
  onRename,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(topic.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const submitRename = () => {
    const trimmed = newName.trim();
    if (trimmed && trimmed !== topic.name) {
      onRename(topic.id, trimmed);
    }
    setEditing(false);
  };

  return (
    <div
      style={{
        padding: "5px 10px",
        backgroundColor: isActive ? "#333" : "transparent",
        display: "flex",
        alignItems: "center",
        cursor: editing ? "text" : "pointer",
        userSelect: editing ? "text" : "none",
        gap: 6,
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={submitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitRename();
            } else if (e.key === "Escape") {
              setNewName(topic.name);
              setEditing(false);
            }
          }}
          style={{
            flex: 1,
            background: "transparent",
            border: "1px solid #666",
            borderRadius: 4,
            color: "white",
            padding: "2px 6px",
          }}
        />
      ) : (
        <>
          <div
            onClick={() => onSelect(topic.id)}
            style={{ flex: 1 }}
            title="Changer de topic"
          >
            {topic.name}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            aria-label="Renommer le topic"
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              padding: 0,
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ✏️
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  `Supprimer le topic "${topic.name}" ? Cette action est irréversible.`
                )
              ) {
                onDelete(topic.id);
              }
            }}
            aria-label="Supprimer le topic"
            style={{
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
              padding: "0 6px",
              fontSize: 16,
              lineHeight: 1,
            }}
            title="Supprimer le topic"
          >
            🗑️
          </button>
        </>
      )}
    </div>
  );
}
