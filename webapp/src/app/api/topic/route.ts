import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name } = body;

		const topic = await prisma.topic.create({
			data: {
				name: name || "Nouveau topic",
			},
		});

		return new Response(JSON.stringify(topic), { status: 201 });
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to create topic" }),
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const topicId = url.searchParams.get("id");

		if (topicId) {
			const topic = await prisma.topic.findUnique({
				where: {
					id: topicId,
				},
				select: {
					id: true,
					name: true,
					messages: {
						select: {
							role: true,
							content: true,
						},
						orderBy: {
							createdAt: "asc",
						},
					},
				},
			});

			if (!topic) {
				return new Response(
					JSON.stringify({ error: "Topic not found" }),
					{ status: 404 },
				);
			}

			return new Response(JSON.stringify(topic), { status: 200 });
		} else {
			const topics = await prisma.topic.findMany({
				select: {
					id: true,
					name: true,
					messages: false,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			console.log("All topics:", topics);

			return new Response(JSON.stringify(topics), { status: 200 });
		}
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch topics" }),
			{ status: 500 },
		);
	}
}

export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { id } = body;

		if (!id) {
			return new Response(
				JSON.stringify({ error: "Topic ID is required" }),
				{ status: 400 },
			);
		}

		await prisma.topic.delete({
			where: {
				id: id,
			},
		});

		return new Response(
			JSON.stringify({ message: "Topic deleted successfully" }),
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to delete topic" }),
			{ status: 500 },
		);
	}
}

export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { id, name } = body;

		if (!id || !name) {
			return new Response(
				JSON.stringify({ error: "Topic ID and new name are required" }),
				{ status: 400 },
			);
		}

		const updatedTopic = await prisma.topic.update({
			where: {
				id: id,
			},
			data: {
				name,
			},
		});

		return new Response(JSON.stringify(updatedTopic), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to update topic" }),
			{ status: 500 },
		);
	}
}
