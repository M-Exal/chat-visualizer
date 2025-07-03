import ReactMarkdown from "react-markdown";

export default function ChatWindow({ messages, bottomRef }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {messages.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "1rem",
              animation: "bounce 2s infinite",
            }}
          >
            🤖
          </div>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#9ca3af",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Pose une question pour commencer la conversation !
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginTop: "0.5rem",
              margin: "0.5rem 0 0 0",
            }}
          >
            Je suis ici pour t'aider avec tes questions
          </p>
        </div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            opacity: 0,
            animation: `slideUp 0.6s ease-out ${idx * 100}ms forwards`,
          }}
        >
          <div
            style={{
              maxWidth: "80%",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
              transition: "all 0.3s ease-in-out",
              ...(msg.role === "user"
                ? {
                    background: "linear-gradient(to right, #2563eb, #7c3aed)",
                    color: "white",
                    borderBottomRightRadius: "0.25rem",
                  }
                : {
                    backgroundColor: "#4b5563",
                    color: "#f3f4f6",
                    borderBottomLeftRadius: "0.25rem",
                    border: "1px solid #6b7280",
                  }),
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>🤖</span>
                Assistant
              </div>
            )}

            <div style={{ lineHeight: "1.6" }}>
              <ReactMarkdown
                components={{
                  code: ({ inline, children, ...props }) => {
                    return inline ? (
                      <code
                        style={{
                          backgroundColor: "#374151",
                          padding: "0.125rem 0.25rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.875rem",
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre
                        style={{
                          backgroundColor: "#374151",
                          padding: "0.75rem",
                          borderRadius: "0.5rem",
                          overflowX: "auto",
                          margin: "0.5rem 0",
                        }}
                      >
                        <code style={{ fontSize: "0.875rem" }} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  p: ({ children }) => (
                    <p
                      style={{ marginBottom: "0.5rem", margin: "0 0 0.5rem 0" }}
                    >
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul
                      style={{
                        listStyle: "disc",
                        listStylePosition: "inside",
                        margin: "0.5rem 0",
                      }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      style={{
                        listStyle: "decimal",
                        listStylePosition: "inside",
                        margin: "0.5rem 0",
                      }}
                    >
                      {children}
                    </ol>
                  ),
                }}
              >
                {msg.content.replace(/\\([*_`])/g, "$1")}
              </ReactMarkdown>
            </div>

            {msg.role === "user" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#bfdbfe",
                }}
              >
                <span style={{ marginRight: "0.25rem" }}>Vous</span>
                <span>👤</span>
              </div>
            )}
          </div>
        </div>
      ))}

      <div ref={bottomRef} style={{ height: "0.25rem" }} />
    </div>
  );
}
