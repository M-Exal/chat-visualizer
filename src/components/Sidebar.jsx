import TopicItem from "./TopicItem";
import { useIsMobile } from "../hooks/useWindowSize";

export default function Sidebar({
  topics,
  currentTopicId,
  setCurrentTopicId,
  addTopic,
  renameTopic,
  deleteTopic,
  isCollapsed = false,
}) {
  const isMobile = useIsMobile();

  if (isCollapsed && !isMobile) {
    return (
      <aside
        style={{
          width: "60px",
          backgroundColor: "#374151",
          borderRight: "1px solid #4b5563",
          padding: "1rem 0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        {/* Version minimaliste pour sidebar collapsée */}
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            🦙
          </div>

          <button
            onClick={addTopic}
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(to right, #2563eb, #7c3aed)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Nouveau topic"
          >
            +
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            width: "100%",
            alignItems: "center",
          }}
        >
          {topics.slice(0, 8).map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => setCurrentTopicId(topic.id)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor:
                  topic.id === currentTopicId ? "#2563eb" : "#4b5563",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "bold",
                transition: "all 0.2s ease-in-out",
              }}
              title={topic.name}
            >
              {index + 1}
            </div>
          ))}

          {topics.length > 8 && (
            <div
              style={{
                width: "40px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "0.75rem",
              }}
            >
              +{topics.length - 8}
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: isMobile ? "280px" : "16rem",
        backgroundColor: "#374151",
        borderRight: "1px solid #4b5563",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "white",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            margin: "0 0 1rem 0",
          }}
        >
          <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>🦙</span>
          Llama Chat
        </h1>
        <button
          onClick={addTopic}
          style={{
            width: "100%",
            background: "linear-gradient(to right, #2563eb, #7c3aed)",
            color: "white",
            fontWeight: "500",
            padding: "0.625rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(to right, #1d4ed8, #6d28d9)";
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(to right, #2563eb, #7c3aed)";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        >
          <span style={{ fontSize: "1.125rem", marginRight: "0.5rem" }}>+</span>
          Nouveau topic
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            style={{
              opacity: 0,
              animation: `fadeInUp 0.5s ease-out ${index * 50}ms forwards`,
            }}
          >
            <TopicItem
              topic={topic}
              isActive={topic.id === currentTopicId}
              onSelect={setCurrentTopicId}
              onRename={renameTopic}
              onDelete={deleteTopic}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid #4b5563",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "#d1d5db",
            textAlign: "center",
            margin: 0,
            fontWeight: "500",
          }}
        >
          📊 {topics.length} topic{topics.length > 1 ? "s" : ""}
        </p>
      </div>
    </aside>
  );
}
