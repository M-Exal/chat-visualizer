import { useCallback } from "react";
import { useApiRequest } from "./useApiRequest";
import { useNotifications } from "./useNotifications";
import { Message, Topic } from "@/lib/type";

interface UseMessageActionsParams {
	currentTopicId: string | null;
	updateTopicById: (
		topicId: string,
		updater: (topic: Topic) => Topic,
	) => void;
	setLoading: (loading: boolean) => void;
}

export function useMessageActions({
	currentTopicId,
	updateTopicById,
	setLoading,
}: UseMessageActionsParams): { sendMessage: (input: string) => Promise<void> } {
	const apiRequest = useApiRequest();
	const { showError } = useNotifications();

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

				updateTopicById(currentTopicId, (t) => ({
					...t,
					messages: [...t.messages, savedMessage],
				}));

				const updateAssistantMessage = (replyContent: string): void => {
					updateTopicById(currentTopicId, (t) => {
						const msgs = [...t.messages];
						const last = msgs[msgs.length - 1];
						if (last?.role === "assistant") {
							msgs[msgs.length - 1] = {
								...last,
								content: replyContent,
							};
						} else {
							msgs.push({
								role: "assistant",
								content: replyContent,
								topicId: currentTopicId,
							});
						}
						return { ...t, messages: msgs.slice(-10) };
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
				updateTopicById(currentTopicId, (t) => ({
					...t,
					messages: [
						...t.messages,
						{
							role: "assistant",
							content: `Erreur : ${msg}`,
							topicId: currentTopicId,
						},
					],
				}));
				showError("Erreur envoi message");
			} finally {
				setLoading(false);
			}
		},
		[
			currentTopicId,
			updateTopicById,
			streamAssistantReply,
			apiRequest,
			showError,
			setLoading,
		],
	);

	return { sendMessage };
}
