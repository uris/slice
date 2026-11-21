/** Reuse the portfolio API; its OpenAI key stays on that server. */
export async function POST(request: Request) {
	const baseUrl = process.env.PRIVATE_API_BASE_URL;
	if (!baseUrl) return Response.json({ message: 'Voice demo is not configured.' }, { status: 503 });
	const origin = request.headers.get('origin');
	if (origin && origin !== new URL(request.url).origin) {
		return Response.json({ message: 'Invalid request origin.' }, { status: 403 });
	}
	try {
		const response = await fetch(`${baseUrl.replace(/\/$/, '')}/openai/realtime/session`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			cache: 'no-store',
			signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
			body: JSON.stringify({
				type: 'realtime',
				model: 'gpt-realtime',
				instructions: 'You are a friendly voice assistant in a UI demo. Keep replies brief and conversational.',
				output_modalities: ['audio'],
				audio: {
					input: {
						noise_reduction: { type: 'far_field' },
						turn_detection: { type: 'semantic_vad', create_response: true, interrupt_response: true },
					},
					output: { voice: 'marin' },
				},
			}),
		});
		if (!response.ok)
			return Response.json(
				{ message: 'Unable to start the voice session. Please try again.' },
				{ status: response.status },
			);
		const data = await response.json();
		if (typeof data.value !== 'string' || !data.value) throw new Error('Missing session token');
		return Response.json({ value: data.value }, { headers: { 'Cache-Control': 'no-store' } });
	} catch {
		return Response.json({ message: 'The voice service could not be reached.' }, { status: 502 });
	}
}
