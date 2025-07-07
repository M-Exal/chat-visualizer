import MessageInput from "./MessageInput";
import { useIsMobile } from "@/hooks/useWindowSize";
import { ChatBubble } from "./ChatBubble";
import { useEffect, useState } from "react";
import { Message } from "@/lib/type";
import { useTopicActions } from "@/hooks/useTopicActions";

interface TopicChatVisualizerProps {
	sendMessage: (message: string) => void;
	loading: boolean;
}

export default function TopicChatVisualizer({
	sendMessage,
	loading,
}: TopicChatVisualizerProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const isMobile = useIsMobile();

	const { currentTopic, currentTopicId } = useTopicActions();

	useEffect(() => {
		if (currentTopic && Array.isArray(currentTopic.messages)) {
			setMessages(currentTopic.messages);
		} else {
			setMessages([]);
		}
	}, [currentTopic, currentTopicId]);

	if (messages.length === 0) {
		return (
			<>
				<div className="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center p-6">
					<div className="text-8xl mb-4 animate-bounce">🤖</div>
					<div className="text-lg text-gray-400 italic">
						Pose une question pour commencer la conversation !
					</div>
					<div className="text-sm text-gray-500 mt-2">
						Je suis ici pour t&apos;aider avec tes questions
					</div>
				</div>
				<MessageInput onSend={sendMessage} loading={loading} />
			</>
		);
	}

	return (
		<>
			<div
				className={`flex-1 overflow-y-auto flex flex-col gap-4 ${isMobile ? "p-4" : "p-6"}`}
			>
				{Array.isArray(messages) &&
					messages.map((msg, idx) => (
						<ChatBubble key={idx} msg={msg} delay={idx * 100} />
					))}
			</div>
			<MessageInput onSend={sendMessage} loading={loading} />
		</>
	);
}
