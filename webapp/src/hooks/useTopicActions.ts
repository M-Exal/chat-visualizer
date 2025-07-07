import { useCallback } from "react";
import { useApiRequest } from "./useApiRequest";
import { useNotifications } from "./useNotifications";
import { Topic } from "@/lib/type";

interface TopicActions {
	fetchTopics: () => Promise<void>;
	fetchMessages: (topicId: string) => Promise<void>;
	addTopic: () => Promise<void>;
	renameTopic: (id: string, name: string) => Promise<void>;
	deleteTopic: (id: string, currentTopicId: string | null) => Promise<void>;
}

interface UpdateTopicById {
	(id: string, updater: (topic: Topic) => Topic): void;
}

export function useTopicActions(
	setTopics: React.Dispatch<React.SetStateAction<Topic[]>>,
	setCurrentTopicId: React.Dispatch<React.SetStateAction<string | null>>,
	updateTopicById: UpdateTopicById,
): TopicActions {
	const apiRequest = useApiRequest();
	const { showSuccess, showError, showInfo } = useNotifications();

	const fetchTopics = useCallback(async () => {
		const data = await apiRequest<Topic[]>(
			"/api/topic",
			undefined,
			"Erreur de chargement des topics",
		);
		if (data) {
			setTopics(data);
			if (data.length > 0) setCurrentTopicId(data[0].id);
		}
	}, [apiRequest, setTopics, setCurrentTopicId]);

	const fetchMessages = useCallback(
		async (topicId: string) => {
			const topic = await apiRequest<Topic>(
				`/api/topic?id=${topicId}`,
				undefined,
				"Erreur chargement messages",
			);
			if (topic) {
				updateTopicById(topicId, (t) => ({
					...t,
					messages: topic.messages,
				}));
			}
		},
		[apiRequest, updateTopicById],
	);

	const addTopic = useCallback(async () => {
		const newTopic = await apiRequest<Topic>(
			"/api/topic",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "Nouveau topic" }),
			},
			"Erreur création topic",
		);
		if (newTopic) {
			setTopics((prev) => [...prev, { ...newTopic, messages: [] }]);
			setCurrentTopicId(newTopic.id);
			showSuccess("Nouveau topic créé !");
		}
	}, [apiRequest, setTopics, setCurrentTopicId, showSuccess]);

	const renameTopic = useCallback(
		async (id: string, name: string) => {
			const updated = await apiRequest<Topic>(
				"/api/topic",
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id, name }),
				},
				"Erreur renommage",
			);
			if (updated) {
				updateTopicById(id, (t) => ({ ...t, name }));
				showInfo(`Topic renommé en "${name}"`);
			}
		},
		[apiRequest, updateTopicById, showInfo],
	);

	const deleteTopic = useCallback(
		async (id: string, currentTopicId: string | null) => {
			const res = await fetch("/api/topic", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) {
				showError("Erreur suppression topic");
				return;
			}

			setTopics((prev) => prev.filter((t) => t.id !== id));
			if (currentTopicId === id) setCurrentTopicId(null);
			showSuccess("Topic supprimé");
		},
		[setTopics, setCurrentTopicId, showError, showSuccess],
	);

	return {
		fetchTopics,
		fetchMessages,
		addTopic,
		renameTopic,
		deleteTopic,
	};
}
