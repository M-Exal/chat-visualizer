import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import NotificationSystem from "./components/NotificationSystem";
import { useNotifications } from "./hooks/useNotifications";
import { useIsMobile } from "./hooks/useWindowSize";

export default function App() {
  const isMobile = useIsMobile();

  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotifications();

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem("llama3_topics");
    if (saved) return JSON.parse(saved);
    return [{ id: uuidv4(), name: "Nouveau topic", messages: [] }];
  });

  const [currentTopicId, setCurrentTopicId] = useState(() => topics[0].id);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const bottomRef = useRef(null);

  const currentTopic = topics.find((t) => t.id === currentTopicId);

  // Fermer le menu mobile lors du changement de topic
  const handleTopicSelect = (topicId) => {
    setCurrentTopicId(topicId);
    setIsMobileMenuOpen(false);
  };

  // Gérer le raccourci clavier Ctrl+B
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        showInfo(
          newState ? "Sidebar masquée (Ctrl+B)" : "Sidebar affichée (Ctrl+B)",
          null,
          2000
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarCollapsed, showInfo]);

  useEffect(() => {
    localStorage.setItem("llama3_topics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [topics, currentTopicId]);

  const addTopic = () => {
    const newTopic = { id: uuidv4(), name: "Nouveau topic", messages: [] };
    setTopics((prev) => [...prev, newTopic]);
    setCurrentTopicId(newTopic.id);
    showSuccess("Nouveau topic créé avec succès !");
  };

  const renameTopic = (id, newName) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, name: newName } : topic
      )
    );
    showInfo(`Topic renommé en "${newName}"`);
  };

  const deleteTopic = (id) => {
    if (topics.length === 1) {
      showWarning("Impossible de supprimer le dernier topic");
      return;
    }
    const topicToDelete = topics.find((t) => t.id === id);
    setTopics((t) => t.filter((topic) => topic.id !== id));
    if (currentTopicId === id) setCurrentTopicId(topics[0]?.id ?? null);
    showSuccess(`Topic "${topicToDelete?.name || "Sans nom"}" supprimé`);
  };

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };

    // Limiter l'historique à 9 messages + le nouveau (donc max 10)
    const oldMessages = currentTopic?.messages || [];
    const limitedMessages =
      oldMessages.length >= 9
        ? oldMessages.slice(oldMessages.length - 9)
        : oldMessages;

    const newMessages = [...limitedMessages, userMessage];

    // Mise à jour immédiate avec le message utilisateur
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === currentTopicId
          ? { ...topic, messages: newMessages }
          : topic
      )
    );

    // Construire le prompt textuel pour l'API
    const prompt =
      newMessages
        .map(
          (msg) =>
            (msg.role === "user" ? "User: " : "Assistant: ") + msg.content
        )
        .join("\n") + "\nAssistant: ";

    setLoading(true);
    showInfo("Envoi du message à Llama...", null, 2000);

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: prompt,
          stream: true,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              assistantReply += data.response;

              setTopics((prev) =>
                prev.map((topic) => {
                  if (topic.id !== currentTopicId) return topic;
                  const messages = [...topic.messages];
                  const last = messages[messages.length - 1];
                  if (last && last.role === "assistant") {
                    messages[messages.length - 1] = {
                      ...last,
                      content: assistantReply,
                    };
                  } else {
                    messages.push({
                      role: "assistant",
                      content: assistantReply,
                    });
                  }
                  // Limiter à 10 messages max après ajout assistant
                  const limited =
                    messages.length > 10
                      ? messages.slice(messages.length - 10)
                      : messages;
                  return { ...topic, messages: limited };
                })
              );
            }
          } catch (e) {
            console.error("Erreur lors du parsing JSON dans le stream:", e);
          }
        }
      }

      // Notification de succès quand la réponse est complète
      showSuccess("Réponse reçue !", null, 2000);
    } catch (e) {
      setTopics((prev) =>
        prev.map((topic) => {
          if (topic.id !== currentTopicId) return topic;
          const messages = [...topic.messages];
          messages.push({
            role: "assistant",
            content: `Erreur : ${e.message}`,
          });
          return { ...topic, messages };
        })
      );
      showError("Erreur lors de l'envoi du message", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background:
          "linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)",
        color: "#f3f4f6",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />

      {/* Bouton menu mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1001,
          display: isMobile ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          border: "none",
          background: "rgba(55, 65, 81, 0.9)",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        {isMobileMenuOpen ? "×" : "☰"}
      </button>

      {/* Bouton collapse sidebar pour desktop */}
      {!isMobile && (
        <button
          onClick={() => {
            const newState = !isSidebarCollapsed;
            setIsSidebarCollapsed(newState);
            showInfo(
              newState ? "Sidebar masquée" : "Sidebar affichée",
              null,
              2000
            );
          }}
          style={{
            position: "fixed",
            top: "1rem",
            left: isSidebarCollapsed ? "1rem" : "calc(280px - 2rem)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(55, 65, 81, 0.9)",
            color: "white",
            fontSize: "1.25rem",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease-in-out",
          }}
          title={`${
            isSidebarCollapsed ? "Ouvrir" : "Fermer"
          } la sidebar (Ctrl+B)`}
        >
          {isSidebarCollapsed ? "→" : "←"}
        </button>
      )}

      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: isMobile ? "block" : "none",
          }}
        />
      )}

      {/* Sidebar avec responsive et collapse */}
      <div
        style={{
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1000,
          transform: isMobile
            ? isMobileMenuOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : isSidebarCollapsed
            ? "translateX(-100%)"
            : "translateX(0)",
          transition: "transform 0.3s ease-in-out",
          width: isMobile ? "280px" : "280px",
        }}
      >
        <Sidebar
          topics={topics}
          currentTopicId={currentTopicId}
          setCurrentTopicId={handleTopicSelect}
          addTopic={addTopic}
          renameTopic={renameTopic}
          deleteTopic={deleteTopic}
          isCollapsed={isSidebarCollapsed && !isMobile}
        />
      </div>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          marginLeft: isMobile ? "0" : isSidebarCollapsed ? "0" : "0",
          width: isMobile ? "100%" : "auto",
        }}
      >
        {currentTopic ? (
          <>
            {/* Indicateur de topic actuel quand sidebar collapsée */}
            {isSidebarCollapsed && !isMobile && (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(55, 65, 81, 0.8)",
                  borderBottom: "1px solid #4b5563",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.25rem" }}>🦙</span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#f3f4f6",
                  }}
                >
                  {currentTopic.name}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                  }}
                >
                  Ctrl+B pour ouvrir la sidebar
                </span>
              </div>
            )}
            <ChatWindow
              messages={currentTopic.messages}
              bottomRef={bottomRef}
            />
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? "3rem" : "4rem",
                marginBottom: "1rem",
                animation: "pulse 2s infinite",
              }}
            >
              💬
            </div>
            <h2
              style={{
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                fontWeight: "600",
                color: "#d1d5db",
                margin: 0,
              }}
            >
              Aucun topic sélectionné
            </h2>
            <p
              style={{
                color: "#9ca3af",
                marginTop: "0.5rem",
                margin: 0,
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              {isMobile
                ? "Appuyez sur ☰ pour voir vos topics"
                : "Sélectionnez un topic pour commencer à chatter"}
            </p>
          </div>
        )}

        <MessageInput onSend={sendMessage} loading={loading} />
      </main>
    </div>
  );
}
