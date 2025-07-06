import { Notification } from "@/lib/type";
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export function useNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = useCallback(
		(notification: Omit<Notification, "id">) => {
			const id = uuidv4();
			const newNotification: Notification = {
				id,
				...notification,
			};

			setNotifications((prev) => [...prev, newNotification]);
			return id;
		},
		[],
	);

	const removeNotification = useCallback((id: string) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	}, []);

	const clearAll = useCallback(() => {
		setNotifications([]);
	}, []);

	// Convenience functions for different types
	const showSuccess = useCallback(
		(
			message: string,
			title: string | null = null,
			duration: number = 4000,
		) => {
			return addNotification({
				type: "success",
				message,
				title,
				duration,
			});
		},
		[addNotification],
	);

	const showError = useCallback(
		(
			message: string,
			title: string | null = null,
			duration: number = 6000,
		) => {
			return addNotification({
				type: "error",
				message,
				title,
				duration,
			});
		},
		[addNotification],
	);

	const showWarning = useCallback(
		(
			message: string,
			title: string | null = null,
			duration: number = 5000,
		) => {
			return addNotification({
				type: "warning",
				message,
				title,
				duration,
			});
		},
		[addNotification],
	);

	const showInfo = useCallback(
		(
			message: string,
			title: string | null = null,
			duration: number = 4000,
		) => {
			return addNotification({
				type: "info",
				message,
				title,
				duration,
			});
		},
		[addNotification],
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
