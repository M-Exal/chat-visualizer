import { useState, useRef, useEffect } from "react";

interface TopicItemProps {
	topic: { id: string; name: string };
	isActive: boolean;
	onSelect: (id: string) => void;
	onRename: (id: string, newName: string) => void;
	onDelete: (id: string) => void;
}

export default function TopicItem({
	topic,
	isActive,
	onSelect,
	onRename,
	onDelete,
}: TopicItemProps) {
	const [editing, setEditing] = useState(false);
	const [newName, setNewName] = useState(topic.name);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	const submitRename = () => {
		const trimmed = newName.trim();
		if (trimmed && trimmed !== topic.name) {
			onRename(topic.id, trimmed);
		}
		setEditing(false);
	};

	const baseClasses =
		"p-3 rounded-lg flex items-center gap-2 transition-all duration-200";
	const activeClasses =
		"bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105";
	const inactiveClasses =
		"bg-gray-600 text-gray-200 hover:bg-gray-500 hover:shadow-md";
	const containerClasses = `${baseClasses} ${
		editing ? "cursor-text" : "cursor-pointer"
	} ${isActive ? activeClasses : inactiveClasses}`;

	return (
		<div
			className={containerClasses}
			onMouseDown={(e) => e.preventDefault()} // prevent focus loss when clicking buttons
		>
			{editing ? (
				<input
					ref={inputRef}
					type="text"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					onBlur={submitRename}
					onKeyDown={(e) => {
						if (e.key === "Enter") submitRename();
						else if (e.key === "Escape") {
							setNewName(topic.name);
							setEditing(false);
						}
					}}
					className="flex-1 bg-transparent border border-gray-500 rounded-md p-1 text-white outline-none"
				/>
			) : (
				<>
					<div
						onClick={() => onSelect(topic.id)}
						className="flex-1 font-medium overflow-hidden text-ellipsis whitespace-nowrap"
						title="Changer de topic"
					>
						{topic.name}
					</div>

					<button
						onClick={(e) => {
							e.stopPropagation();
							setEditing(true);
						}}
						className="group-hover:opacity-100 transition-opacity p-1 rounded-md text-sm hover:bg-white/20"
						aria-label="Renommer le topic"
						title="Renommer"
					>
						✏️
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation();
							if (
								window.confirm(
									`Supprimer le topic "${topic.name}" ? Cette action est irréversible.`,
								)
							) {
								onDelete(topic.id);
							}
						}}
						className="sgroup-hover:opacity-100 transition-opacity p-1 rounded-md text-sm text-red-400 hover:text-red-300 hover:bg-red-400/20"
						aria-label="Supprimer le topic"
						title="Supprimer"
					>
						🗑️
					</button>
				</>
			)}
		</div>
	);
}
