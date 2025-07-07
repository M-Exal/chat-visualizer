import { useCallback, useEffect, useState } from "react";
import { useApiRequest } from "./useApiRequest";
import { useNotifications } from "./useNotifications";
import { Message, Topic } from "@/lib/type";

export function useTopicActions() {
	const apiRequest = useApiRequest();
	const [topics, setTopics] = useState<Topic[]>([]);
	const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
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

	const getTopics = () => {
		if (topics.length === 0) {
			fetchTopics();
			return [];
		}
		return topics;
	};

	const getTopicById = (id: string | null): Topic | undefined => {
		return topics.find((topic) => topic.id === id);
	};

	const currentTopic = getTopicById(currentTopicId);

	const TopicAddMessage = useCallback(
		(topicId: string, message: Message) => {
			setTopics((prev) =>
				prev.map((t) =>
					t.id === topicId
						? { ...t, messages: [...(t.messages || []), message] }
						: t,
				),
			);
		},
		[setTopics],
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
				setTopics((prevTopics) =>
					prevTopics.map((t) => (t.id === id ? { ...t, name } : t)),
				);
				showInfo(`Topic renommé en "${name}"`);
			}
		},
		[apiRequest, showInfo],
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

	const fetchTopicMessages = useCallback(async () => {
		console.log("Fetching messages for topic ID:", currentTopicId);
		const topic = await apiRequest<Topic>(
			`/api/topic?id=${currentTopicId}`,
			undefined,
			"Erreur chargement messages",
		);
		if (topic) {
			setTopics((prevTopics) =>
				prevTopics.map((t) =>
					t.id === currentTopicId
						? { ...t, messages: topic.messages }
						: t,
				),
			);
		}
		console.log("Messages fetched:", topic?.messages);
	}, [apiRequest, currentTopicId]);

	useEffect(() => {
		if (currentTopicId) {
			fetchTopicMessages();
		}
	}, [currentTopicId, fetchTopicMessages]);

	useEffect(() => {
		fetchTopics();
	}, [fetchTopics]);

	return {
		fetchTopics,
		getTopics,
		addTopic,
		TopicAddMessage,
		fetchTopicMessages,
		renameTopic,
		deleteTopic,
		getTopicById,
		currentTopic,
		currentTopicId,
		setCurrentTopicId,
	};
}
