import { useCallback, useState } from "react";
import { useApiRequest } from "./useApiRequest";
import { useNotifications } from "./useNotifications";
import { Message } from "@/lib/type";
import { useTopicActions } from "./useTopicActions";

export function useMessageActions(): {
	loading: boolean;
	sendMessage: (input: string) => Promise<void>;
} {
	const [loading, setLoading] = useState(false);
	const apiRequest = useApiRequest();
	const { showError } = useNotifications();

	const { currentTopicId, TopicAddMessage } = useTopicActions();

	const streamAssistantReply = useCallback(
		async (
			prompt: string,
			onChunk: (chunk: string) => void,
		): Promise<string> => {
			const res = await fetch(
				`/api/askollama?prompt=${encodeURIComponent(prompt)}`,
			);
			if (!res.ok || !res.body) throw new Error("Erreur streaming");

			const reader = res.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let reply = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				reply += chunk;
				onChunk(reply);
			}

			return reply;
		},
		[],
	);

	const sendMessage = useCallback(
		async (input: string): Promise<void> => {
			if (!input.trim() || !currentTopicId) return;
			setLoading(true);
			const content = input.trim();

			try {
				const savedMessage = await apiRequest<Message>("/api/message", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ topicId: currentTopicId, content }),
				});
				if (!savedMessage)
					throw new Error("Message utilisateur non sauvegardé");

				TopicAddMessage(currentTopicId, savedMessage);

				const updateAssistantMessage = (replyContent: string): void => {
					TopicAddMessage(currentTopicId, {
						role: "assistant",
						content: replyContent,
						topicId: currentTopicId,
					});
				};

				const reply = await streamAssistantReply(
					content,
					updateAssistantMessage,
				);

				await fetch("/api/message", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						topicId: currentTopicId,
						content: reply,
						role: "assistant",
					}),
				});
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Erreur";
				TopicAddMessage(currentTopicId, {
					role: "assistant",
					content: `Erreur : ${msg}`,
					topicId: currentTopicId,
				});
				showError("Erreur envoi message");
			} finally {
				setLoading(false);
			}
		},
		[
			currentTopicId,
			streamAssistantReply,
			apiRequest,
			showError,
			setLoading,
			TopicAddMessage,
		],
	);

	return { loading, sendMessage };
}
