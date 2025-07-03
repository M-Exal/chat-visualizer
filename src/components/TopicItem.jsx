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
  const [isHovered, setIsHovered] = useState(false);
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

  const baseStyle = {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s ease-in-out",
    cursor: editing ? "text" : "pointer",
  };

  const activeStyle = isActive
    ? {
        background: "linear-gradient(to right, #2563eb, #7c3aed)",
        color: "white",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
        transform: "scale(1.02)",
      }
    : {
        backgroundColor: "#4b5563",
        color: "#e5e7eb",
      };

  const hoverStyle =
    !isActive && isHovered
      ? {
          backgroundColor: "#6b7280",
          boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.15)",
        }
      : {};

  return (
    <div
      style={{ ...baseStyle, ...activeStyle, ...hoverStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            backgroundColor: "transparent",
            border: "1px solid #6b7280",
            borderRadius: "0.25rem",
            padding: "0.25rem 0.5rem",
            color: "white",
            outline: "none",
          }}
        />
      ) : (
        <>
          <div
            onClick={() => onSelect(topic.id)}
            style={{
              flex: 1,
              fontWeight: "500",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title="Changer de topic"
          >
            {topic.name}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              padding: "0.25rem",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              cursor: "pointer",
              color: "inherit",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
            aria-label="Renommer le topic"
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
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              padding: "0.25rem",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              cursor: "pointer",
              color: "#f87171",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(248, 113, 113, 0.2)";
              e.target.style.color = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#f87171";
            }}
            aria-label="Supprimer le topic"
            title="Supprimer le topic"
          >
            🗑️
          </button>
        </>
      )}
    </div>
  );
}
