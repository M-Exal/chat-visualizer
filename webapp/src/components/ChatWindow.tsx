import ReactMarkdown from "react-markdown";
import { useIsMobile } from "../hooks/useWindowSize";

import { ChatBubbleProps, ChatWindowProps } from "@/lib/type";

export default function ChatWindow({ messages = [] }: ChatWindowProps) {
	const isMobile = useIsMobile();

	if (messages.length === 0) {
		return (
			<div className="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center p-6">
				<div className="text-8xl mb-4 animate-bounce">🤖</div>
				<div className="text-lg text-gray-400 italic">
					Pose une question pour commencer la conversation !
				</div>
				<div className="text-sm text-gray-500 mt-2">
					Je suis ici pour t&apos;aider avec tes questions
				</div>
			</div>
		);
	}

	return (
		<div
			className={`flex-1 overflow-y-auto flex flex-col gap-4 ${isMobile ? "p-4" : "p-6"}`}
		>
			{Array.isArray(messages) &&
				messages.map((msg, idx) => (
					<ChatBubble key={idx} msg={msg} delay={idx * 100} />
				))}
		</div>
	);
}

function ChatBubble({ msg, delay }: ChatBubbleProps) {
	const isUser = msg.role === "user";
	const containerClass = `flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`;
	const bubbleBase = `transition-transform shadow-lg max-w-[90%] md:max-w-[80%] p-3 md:p-4 rounded-lg md:rounded-xl`;
	const userStyle = `bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md`;
	const assistantStyle = `bg-gray-600 text-gray-100 rounded-bl-md border border-gray-500`;

	return (
		<div
			className={containerClass}
			style={{ animationDelay: `${delay}ms` }}
		>
			<div
				className={`${bubbleBase} ${isUser ? userStyle : assistantStyle}`}
				onMouseEnter={(e) =>
					(e.currentTarget.style.transform = "scale(1.02)")
				}
				onMouseLeave={(e) =>
					(e.currentTarget.style.transform = "scale(1)")
				}
			>
				{!isUser && (
					<div className="flex items-center mb-2 text-xs text-gray-400">
						<span className="mr-2">🤖</span>Assistant
					</div>
				)}

				<div className="leading-relaxed">
					<ReactMarkdown
						components={{
							code: ({ inline, children, ...props }) =>
								inline ? (
									<code
										className="bg-gray-700 px-1 py-0.5 rounded text-sm"
										{...props}
									>
										{children}
									</code>
								) : (
									<div className="bg-gray-700 p-3 rounded overflow-x-auto my-2">
										<code className="text-sm" {...props}>
											{children}
										</code>
									</div>
								),
							p: ({ children }) => (
								<div className="mb-2">{children}</div>
							),
							ul: ({ children }) => (
								<ul className="list-disc list-inside my-2">
									{children}
								</ul>
							),
							ol: ({ children }) => (
								<ol className="list-decimal list-inside my-2">
									{children}
								</ol>
							),
						}}
					>
						{msg.content.replace(/\\([*_`])/g, "$1")}
					</ReactMarkdown>
				</div>

				{isUser && (
					<div className="flex items-center justify-end mt-2 text-xs text-blue-300">
						<span className="mr-1">Vous</span>
						<span>👤</span>
					</div>
				)}
			</div>
		</div>
	);
}
