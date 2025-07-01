import ReactMarkdown from "react-markdown";

export default function ChatWindow({ messages, bottomRef }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        marginBottom: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {messages.length === 0 && (
        <p style={{ fontStyle: "italic", color: "#888" }}>
          Pose une question pour commencer.
        </p>
      )}
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.role === "user" ? "#2563eb" : "#444",
            color: "white",
            padding: 10,
            borderRadius: 8,
            maxWidth: "70%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <ReactMarkdown>
            {msg.content.replace(/\\([*_`])/g, "$1")}
          </ReactMarkdown>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
