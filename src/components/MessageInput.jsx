import { useState } from "react";

export default function MessageInput({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <textarea
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        placeholder="Tape ta question ici..."
        style={{
          flex: 1,
          resize: "none",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #555",
          backgroundColor: "#222",
          color: "#eee",
          outline: "none",
          fontFamily: "inherit",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        style={{
          backgroundColor: loading || !input.trim() ? "#555" : "#22c55e",
          border: "none",
          color: "white",
          borderRadius: 8,
          padding: "0 20px",
          cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Chargement..." : "Envoyer"}
      </button>
    </div>
  );
}
