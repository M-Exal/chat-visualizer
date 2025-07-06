import { useState } from "react";
import { useIsMobile } from "../hooks/useWindowSize";

interface MessageInputProps {
	onSend: (message: string) => void;
	loading: boolean;
}

export default function MessageInput({ onSend, loading }: MessageInputProps) {
	const [input, setInput] = useState<string>("");
	const isMobile = useIsMobile();

	const handleSend = () => {
		if (!input.trim()) return;
		onSend(input);
		setInput("");
	};

	const containerPadding = isMobile ? "p-4" : "p-6";
	const layoutDirection = isMobile ? "flex-col gap-2" : "flex-row gap-3";
	const textSize = isMobile ? "text-lg" : "text-base";
	const textareaPadding = isMobile ? "p-3 pr-10" : "p-4 pr-12";

	const buttonEnabledClasses =
		"bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-lg active:scale-95";
	const buttonDisabledClasses =
		"bg-gray-500 text-gray-400 cursor-not-allowed";

	const buttonClasses = `rounded-xl font-semibold flex items-center justify-center transition-transform ${
		isMobile ? "p-3" : "px-6 py-3"
	} ${input.trim() && !loading ? buttonEnabledClasses : buttonDisabledClasses}`;

	return (
		<div
			className={`${containerPadding} border-t border-gray-600 bg-gray-700`}
		>
			<div className={`flex max-w-4xl mx-auto ${layoutDirection}`}>
				<div className="flex-1 relative">
					<textarea
						rows={isMobile ? 2 : 3}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						disabled={loading}
						placeholder={
							isMobile
								? "Votre message..."
								: "Tape ta question ici... (Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne)"
						}
						className={`w-full resize-none ${textareaPadding} ${textSize} rounded-xl border border-gray-500 bg-gray-600 text-gray-100 outline-none transition-opacity ${
							loading
								? "opacity-50 cursor-not-allowed"
								: "opacity-100"
						} focus:border-blue-500 focus:ring-2 focus:ring-blue-300`}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
					/>
					{input.trim() && (
						<div className="absolute bottom-3 right-3 text-xs text-gray-400">
							{input.length} caractères
						</div>
					)}
				</div>

				<button
					onClick={handleSend}
					disabled={loading || !input.trim()}
					className={buttonClasses}
				>
					{loading ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
							Chargement...
						</div>
					) : (
						<div className="flex items-center gap-2">
							<span>Envoyer</span>
							<span className="text-lg">🚀</span>
						</div>
					)}
				</button>
			</div>
		</div>
	);
}
