import { useState } from "react";

export default function MessageInput({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        borderTop: "1px solid #4b5563",
        backgroundColor: "#374151",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          maxWidth: "64rem",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Tape ta question ici... (Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne)"
            style={{
              width: "100%",
              resize: "none",
              padding: "1rem",
              paddingRight: "3rem",
              borderRadius: "1rem",
              border: "1px solid #6b7280",
              backgroundColor: "#4b5563",
              color: "#f3f4f6",
              outline: "none",
              transition: "all 0.2s ease-in-out",
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "text",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#6b7280";
              e.target.style.boxShadow = "none";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          {input.trim() && (
            <div
              style={{
                position: "absolute",
                bottom: "0.75rem",
                right: "0.75rem",
                fontSize: "0.75rem",
                color: "#9ca3af",
              }}
            >
              {input.length} caractères
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "1rem",
            fontWeight: "600",
            border: "none",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            ...(loading || !input.trim()
              ? {
                  backgroundColor: "#6b7280",
                  color: "#9ca3af",
                }
              : {
                  background: "linear-gradient(to right, #10b981, #3b82f6)",
                  color: "white",
                }),
          }}
          onMouseEnter={(e) => {
            if (!loading && input.trim()) {
              e.target.style.background =
                "linear-gradient(to right, #059669, #2563eb)";
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.25)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && input.trim()) {
              e.target.style.background =
                "linear-gradient(to right, #10b981, #3b82f6)";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }
          }}
          onMouseDown={(e) => {
            if (!loading && input.trim()) {
              e.target.style.transform = "scale(0.95)";
            }
          }}
          onMouseUp={(e) => {
            if (!loading && input.trim()) {
              e.target.style.transform = "scale(1.05)";
            }
          }}
        >
          {loading ? (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "1rem",
                  height: "1rem",
                  border: "2px solid #9ca3af",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              Chargement...
            </div>
          ) : (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span>Envoyer</span>
              <span style={{ fontSize: "1.125rem" }}>🚀</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
