export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const prompt = searchParams.get("prompt") || "Bonjour, qui es-tu ?";

	const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL;

	if (!ollamaUrl) {
		return new Response(
			JSON.stringify({
				error: "NEXT_PUBLIC_OLLAMA_URL n'est pas défini dans l'environnement.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	try {
		const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: "llama3",
				prompt,
				stream: true,
			}),
		});

		if (!ollamaResponse.ok || !ollamaResponse.body) {
			const errorText = await ollamaResponse.text();
			return new Response(
				JSON.stringify({
					error: "Erreur lors de l'appel à Ollama",
					status: ollamaResponse.status,
					details: errorText,
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const encoder = new TextEncoder();
		const decoder = new TextDecoder();
		const reader = ollamaResponse.body.getReader();

		const stream = new ReadableStream({
			async start(controller) {
				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						const chunkText = decoder.decode(value, {
							stream: true,
						});
						const lines = chunkText.split("\n").filter(Boolean);

						for (const line of lines) {
							try {
								const data = JSON.parse(line);
								if (data.response) {
									controller.enqueue(
										encoder.encode(data.response),
									);
								}
							} catch (err) {
								console.warn(
									"Impossible de parser une ligne JSON :",
									line,
									err,
								);
							}
						}
					}
				} catch (streamError) {
					console.error("Erreur pendant le stream :", streamError);
					controller.error(streamError);
				} finally {
					controller.close();
					reader.releaseLock();
				}
			},
		});

		return new Response(stream, {
			status: 200,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Transfer-Encoding": "chunked",
				"Cache-Control": "no-cache",
			},
		});
	} catch (error) {
		console.error("Erreur générale :", error);
		return new Response(
			JSON.stringify({
				error:
					error instanceof Error ? error.message : "Erreur inconnue",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
