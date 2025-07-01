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
        width: 250,
        backgroundColor: "#222",
        color: "#eee",
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      <button onClick={addTopic} style={{ marginBottom: 10 }}>
        + Nouveau topic
      </button>
      {topics.map((topic) => (
        <TopicItem
          key={topic.id}
          topic={topic}
          isActive={topic.id === currentTopicId}
          onSelect={setCurrentTopicId}
          onRename={renameTopic}
          onDelete={deleteTopic}
        />
      ))}
      {/* Bouton suppression etc. selon ton UI */}
    </aside>
  );
}
