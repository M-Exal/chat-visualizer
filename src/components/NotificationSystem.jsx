import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/useWindowSize";

export default function NotificationSystem({
  notifications,
  removeNotification,
}) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: "fixed",
        top: isMobile ? "5rem" : "1rem",
        right: "1rem",
        left: isMobile ? "1rem" : "auto",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 50);

    // Auto-dismiss après le délai spécifié
    if (notification.duration) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          onClose();
        }, 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getNotificationStyle = () => {
    const baseStyle = {
      padding: "1rem 1.25rem",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      maxWidth: isMobile ? "calc(100vw - 2rem)" : "400px",
      minWidth: isMobile ? "auto" : "300px",
      cursor: "pointer",
      transform: isVisible && !isLeaving ? "translateX(0)" : "translateX(100%)",
      opacity: isVisible && !isLeaving ? 1 : 0,
      transition: "all 0.3s ease-in-out",
      border: "1px solid",
    };

    const typeStyles = {
      success: {
        backgroundColor: "#065f46",
        borderColor: "#10b981",
        color: "#d1fae5",
      },
      error: {
        backgroundColor: "#7f1d1d",
        borderColor: "#ef4444",
        color: "#fecaca",
      },
      warning: {
        backgroundColor: "#92400e",
        borderColor: "#f59e0b",
        color: "#fef3c7",
      },
      info: {
        backgroundColor: "#1e3a8a",
        borderColor: "#3b82f6",
        color: "#dbeafe",
      },
    };

    return {
      ...baseStyle,
      ...typeStyles[notification.type],
    };
  };

  const getIcon = () => {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };
    return icons[notification.type] || "ℹ️";
  };

  return (
    <div style={getNotificationStyle()} onClick={handleClose}>
      <span style={{ fontSize: "1.25rem" }}>{getIcon()}</span>

      <div style={{ flex: 1 }}>
        {notification.title && (
          <div
            style={{
              fontWeight: "600",
              marginBottom: "0.25rem",
              fontSize: "0.875rem",
            }}
          >
            {notification.title}
          </div>
        )}
        <div style={{ fontSize: "0.875rem" }}>{notification.message}</div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          padding: "0.25rem",
          borderRadius: "0.25rem",
          opacity: 0.7,
          fontSize: "1rem",
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = 1;
          e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = 0.7;
          e.target.style.backgroundColor = "transparent";
        }}
      >
        ×
      </button>
    </div>
  );
}
