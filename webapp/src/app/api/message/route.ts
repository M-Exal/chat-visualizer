import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { topicId, content, role } = body;

		if (!topicId || !content) {
			return new Response(
				JSON.stringify({ error: "Topic ID and content are required" }),
				{ status: 400 },
			);
		}

		const message = await prisma.message.create({
			data: {
				content,
				topicId,
				role,
			},
		});

		return new Response(JSON.stringify(message), { status: 201 });
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to create message" }),
			{ status: 500 },
		);
	}
}
