import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = uuidv4();
    const newNotification = {
      id,
      duration: 5000, // 5 secondes par défaut
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Fonctions de commodité pour différents types
  const showSuccess = useCallback(
    (message, title = null, duration = 4000) => {
      return addNotification({
        type: "success",
        message,
        title,
        duration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message, title = null, duration = 6000) => {
      return addNotification({
        type: "error",
        message,
        title,
        duration,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, title = null, duration = 5000) => {
      return addNotification({
        type: "warning",
        message,
        title,
        duration,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, title = null, duration = 4000) => {
      return addNotification({
        type: "info",
        message,
        title,
        duration,
      });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
