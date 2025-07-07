export interface Message {
	role: "user" | "assistant";
	topicId: string;
	content: string;
}

export interface Topic {
	id: string;
	name: string;
	messages: Message[];
	createdAt: string;
}

export interface Message {
	role: "user" | "assistant";
	content: string;
}

export interface Notification {
	id: string;
	type: "success" | "error" | "warning" | "info";
	title: string | null | undefined;
	message: string;
	duration?: number;
}
