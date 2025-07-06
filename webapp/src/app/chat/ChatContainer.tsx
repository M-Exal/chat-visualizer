import ChatWindow from "../../components/ChatWindow";
import MessageInput from "../../components/MessageInput";
import EmptyState from "../../components/EmptyState";
import { Message } from "@/lib/type";

interface ChatContainerProps {
	currentTopic: { name: string; messages: Message[] } | null;
	isSidebarCollapsed: boolean;
	isMobile: boolean;
	sendMessage: (message: string) => void;
	loading: boolean;
}

export default function ChatContainer({
	currentTopic,
	isSidebarCollapsed,
	isMobile,
	sendMessage,
	loading,
}: ChatContainerProps) {
	if (!currentTopic) return <EmptyState isMobile={isMobile} />;

	return (
		<>
			{isSidebarCollapsed && !isMobile && (
				<div className="px-4 py-2 bg-gray-700 border-b border-gray-600">
					<strong>{currentTopic.name}</strong>
				</div>
			)}
			<ChatWindow messages={currentTopic.messages} />
			<MessageInput onSend={sendMessage} loading={loading} />
		</>
	);
}
