import TopicItem from "./TopicItem";

export default function Sidebar({
  topics,
  currentTopicId,
  setCurrentTopicId,
  addTopic,
  renameTopic,
  deleteTopic,
}) {
  return (
    <aside
      style={{
        width: "16rem",
        backgroundColor: "#374151",
        borderRight: "1px solid #4b5563",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
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
