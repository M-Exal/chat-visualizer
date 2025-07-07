"use client";

import NotificationSystem from "@/components/NotificationSystem";
import { useIsMobile } from "@/hooks/useWindowSize";
import Sidebar from "@/components/Sidebar";
import TopicChatVisualizer from "@/components/TopicChatVisualizer";
import { useMessageActions } from "@/hooks/useMessageActions";

export default function App() {
	const isMobile = useIsMobile();

	const { sendMessage, loading } = useMessageActions();

	return (
		<div className="flex h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-gray-100 font-sans">
			<NotificationSystem />

			<Sidebar isMobile={isMobile} />

			<main className="flex flex-col flex-1">
				<TopicChatVisualizer
					sendMessage={sendMessage}
					loading={loading}
				/>
			</main>
		</div>
	);
}
