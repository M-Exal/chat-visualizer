"use client";

import NotificationSystem from "@/components/NotificationSystem";
import ChatContainer from "@/app/chat/ChatContainer";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useChatLogic } from "@/app/chat/useChatLogic";
import { useIsMobile } from "@/hooks/useWindowSize";
import Sidebar from "@/components/Sidebar";
import SidebarToggleButton from "@/components/SidebarToggleButton";

export default function App() {
	const isMobile = useIsMobile();

	const {
		topics,
		currentTopicId,
		currentTopic,
		setCurrentTopicId,
		isMobileMenuOpen,
		setIsMobileMenuOpen,
		isSidebarCollapsed,
		toggleSidebar,
		addTopic,
		renameTopic,
		deleteTopic,
		sendMessage,
		loading,
	} = useChatLogic();

	useKeyboardShortcuts(toggleSidebar);

	return (
		<div className="flex h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-gray-100 font-sans">
			<NotificationSystem />

			<SidebarToggleButton
				isMobile={isMobile}
				isSidebarCollapsed={isSidebarCollapsed}
				isMobileMenuOpen={isMobileMenuOpen}
				toggleSidebar={toggleSidebar}
				toggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)}
			/>

			{isMobileMenuOpen && (
				<div
					onClick={() => setIsMobileMenuOpen(false)}
					className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
				/>
			)}

			<Sidebar
				isMobile={isMobile}
				isMobileMenuOpen={isMobileMenuOpen}
				isSidebarCollapsed={isSidebarCollapsed}
				topics={topics}
				currentTopicId={currentTopicId ?? ""}
				setCurrentTopicId={setCurrentTopicId}
				addTopic={addTopic}
				renameTopic={renameTopic}
				deleteTopic={deleteTopic}
			/>

			<main className="flex flex-col flex-1">
				<ChatContainer
					currentTopic={currentTopic}
					isSidebarCollapsed={isSidebarCollapsed}
					isMobile={isMobile}
					sendMessage={sendMessage}
					loading={loading}
				/>
			</main>
		</div>
	);
}
