import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/useWindowSize";
import { Notification } from "@/lib/type";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationItemProps {
	notification: Notification;
	onClose: () => void;
}

export default function NotificationSystem() {
	const { notifications, removeNotification } = useNotifications();
	const isMobile = useIsMobile();

	const containerPosition = isMobile
		? "top-20 left-4 right-4"
		: "top-4 right-4";

	return (
		<div className={`fixed z-50 flex flex-col gap-2 ${containerPosition}`}>
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

function NotificationItem({ notification, onClose }: NotificationItemProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);

	useEffect(() => {
		const enterTimeout = setTimeout(() => setIsVisible(true), 50);

		let autoCloseTimeout: NodeJS.Timeout | undefined;
		if (notification.duration) {
			autoCloseTimeout = setTimeout(() => {
				setIsLeaving(true);
				setTimeout(onClose, 300);
			}, notification.duration);
		}

		return () => {
			clearTimeout(enterTimeout);
			if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
		};
	}, [notification.duration, onClose]);

	const handleClose = () => {
		setIsLeaving(true);
		setTimeout(onClose, 300);
	};

	const baseClasses =
		"p-4 rounded-lg shadow-lg flex items-center gap-3 cursor-pointer transition-transform duration-300 ease-in-out";
	const transitionClasses =
		isVisible && !isLeaving
			? "translate-x-0 opacity-100"
			: "translate-x-full opacity-0";

	const typeClasses =
		{
			success: "bg-green-800 border border-green-500 text-green-100",
			error: "bg-red-800 border border-red-500 text-red-100",
			warning: "bg-yellow-800 border border-yellow-500 text-yellow-100",
			info: "bg-blue-800 border border-blue-500 text-blue-100",
		}[notification.type] || "bg-gray-700 border border-gray-500 text-white";

	const notificationClass = `${baseClasses} ${transitionClasses} ${typeClasses}`;

	const icon =
		{
			success: "✅",
			error: "❌",
			warning: "⚠️",
			info: "ℹ️",
		}[notification.type] || "ℹ️";

	return (
		<div className={notificationClass} onClick={handleClose}>
			<span className="text-xl">{icon}</span>

			<div className="flex-1">
				{notification.title && (
					<div className="font-semibold mb-1 text-sm">
						{notification.title}
					</div>
				)}
				<div className="text-sm">{notification.message}</div>
			</div>

			<button
				onClick={(e) => {
					e.stopPropagation();
					handleClose();
				}}
				className="bg-none border-none text-inherit cursor-pointer p-1 rounded opacity-70 text-lg hover:opacity-100 hover:bg-white/10"
			>
				×
			</button>
		</div>
	);
}
