import { useTopicActions } from "@/hooks/useTopicActions";
import TopicItem from "./TopicItem";
import { useCallback, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import SidebarToggleButton from "./SidebarToggleButton";
import { useNotifications } from "@/hooks/useNotifications";

export default function Sidebar({ isMobile }: { isMobile: boolean }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const isCollapsed = !isMobile && isSidebarCollapsed;

	const { showInfo } = useNotifications();
	const {
		addTopic,
		getTopics,
		deleteTopic,
		renameTopic,
		setCurrentTopicId,
		currentTopicId,
	} = useTopicActions();
	const topics = getTopics();

	const containerClass = `${
		isMobile
			? "fixed top-0 left-0 z-[1000] h-full w-72 transition-transform duration-300 ease-in-out"
			: "relative h-full w-72"
	} ${
		isMobile
			? isMobileMenuOpen
				? "translate-x-0"
				: "-translate-x-full"
			: isSidebarCollapsed
				? "-translate-x-full"
				: "translate-x-0"
	}`;

	const fullWidth = isMobile ? "w-70" : "w-64";
	const collapsedTopicBg = (isActive: boolean): string =>
		isActive ? "bg-blue-600" : "bg-gray-600";

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

	useKeyboardShortcuts(toggleSidebar);

	return (
		<div className={containerClass}>
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
			{/* === COLLAPSED SIDEBAR === */}
			{isCollapsed ? (
				<aside className="w-15 bg-gray-700 border-r border-gray-600 p-4 flex flex-col items-center shadow-lg h-screen overflow-hidden">
					<div className="mb-4">
						<div className="text-2xl mb-4 text-center">🦙</div>
						<button
							onClick={addTopic}
							className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg cursor-pointer text-xl flex items-center justify-center"
							title="Nouveau topic"
						>
							+
						</button>
					</div>

					<div className="flex flex-col gap-2 w-full items-center">
						{topics.slice(0, 8).map((topic, index) => (
							<div
								key={topic.id}
								onClick={() => setCurrentTopicId(topic.id)}
								className={`w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center text-white text-xs font-bold transition-all ${collapsedTopicBg(
									topic.id === currentTopicId,
								)}`}
								title={topic.name}
							>
								{index + 1}
							</div>
						))}

						{topics.length > 8 && (
							<div className="w-10 h-5 flex items-center justify-center text-gray-400 text-xs">
								+{topics.length - 8}
							</div>
						)}
					</div>
				</aside>
			) : (
				/* === EXPANDED SIDEBAR === */
				<aside
					className={`${fullWidth} bg-gray-700 border-r border-gray-600 p-4 flex flex-col shadow-lg h-screen overflow-auto`}
				>
					<div className="mb-6">
						<h1 className="text-xl font-bold text-white mb-4 flex items-center">
							<span className="text-2xl mr-2">🦙</span>
							Llama Chat
						</h1>

						<button
							onClick={addTopic}
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 rounded-lg border-none cursor-pointer transition-all flex items-center justify-center hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg"
						>
							<span className="text-lg mr-2">+</span>
							Nouveau topic
						</button>
					</div>

					<div className="flex-1 overflow-auto flex flex-col gap-2">
						<button
							onClick={() => {
								if (
									window.confirm(
										"Are you sure you want to delete all topics?",
									)
								) {
									setTimeout(() => {
										topics.forEach((topic) =>
											deleteTopic(
												topic.id,
												currentTopicId,
											),
										);
									}, 200);
								}
							}}
							className="w-full bg-red-600 text-white font-medium py-2 rounded-lg border-none cursor-pointer transition-all flex items-center justify-center hover:bg-red-700 hover:scale-105 hover:shadow-lg"
						>
							<span className="text-lg mr-2">🗑️</span>
							Delete All Topics
						</button>
						{topics.map((topic, index) => (
							<div
								key={topic.id}
								className="animate-fade-in"
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<TopicItem
									topic={topic}
									isActive={topic.id === currentTopicId}
									onSelect={setCurrentTopicId}
									onRename={renameTopic}
									onDelete={(id) =>
										deleteTopic(id, currentTopicId)
									}
								/>
							</div>
						))}
					</div>

					<div className="mt-4 pt-4 border-t border-gray-600">
						<p className="text-xs text-gray-400 text-center font-medium">
							📊 {topics.length} topic
							{topics.length > 1 ? "s" : ""}
						</p>
					</div>
				</aside>
			)}
		</div>
	);
}
