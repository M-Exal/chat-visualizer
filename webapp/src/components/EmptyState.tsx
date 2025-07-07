export default function EmptyState({ isMobile }: { isMobile: boolean }) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center text-center px-8 py-4">
			<div className="text-5xl mb-4" aria-hidden="true">
				💬
			</div>
			<h2 className="text-xl font-semibold">Aucun topic sélectionné</h2>
			<p className="text-gray-400">
				{isMobile
					? "Appuyez sur ☰ pour voir vos topics"
					: "Sélectionnez un topic pour commencer à chatter"}
			</p>
		</div>
	);
}
