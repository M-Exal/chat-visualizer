import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useTopicActions } from "@/hooks/useTopicActions";
import { useMessageActions } from "@/hooks/useMessageActions";
import { Topic } from "@/lib/type";

export function useChatLogic() {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const { showInfo } = useNotifications();

	const currentTopic = useMemo(
		() => topics.find((t) => t.id === currentTopicId) || null,
		[topics, currentTopicId],
	);

	const updateTopicById = useCallback(
		(id: string, updater: (t: Topic) => Topic) => {
			setTopics((prev) =>
				prev.map((t) => (t.id === id ? updater(t) : t)),
			);
		},
		[],
	);

	const { fetchTopics, fetchMessages, addTopic, renameTopic, deleteTopic } =
		useTopicActions(setTopics, setCurrentTopicId, updateTopicById);

	const { sendMessage } = useMessageActions({
		currentTopicId,
		updateTopicById,
		setLoading,
	});

	const toggleSidebar = useCallback(() => {
		setIsSidebarCollapsed((prev) => {
			const next = !prev;
			showInfo(
				next ? "Sidebar masquée (Ctrl+B)" : "Sidebar affichée (Ctrl+B)",
				null,
				2000,
			);
			return next;
		});
	}, [showInfo]);

	useEffect(() => {
		fetchTopics();
	}, [fetchTopics]);

	useEffect(() => {
		if (currentTopicId) fetchMessages(currentTopicId);
	}, [currentTopicId, fetchMessages]);

	return {
		topics,
		currentTopic,
		currentTopicId,
		setCurrentTopicId,
		isMobileMenuOpen,
		setIsMobileMenuOpen,
		isSidebarCollapsed,
		toggleSidebar,
		addTopic,
		renameTopic,
		deleteTopic: (id: string) => deleteTopic(id, currentTopicId),
		sendMessage,
		loading,
	};
}
