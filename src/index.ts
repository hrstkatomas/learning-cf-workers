import { counterClient } from './client';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.url.endsWith('/favicon.ico')) return new Response('', { status: 404 });

		const id = env.COUNTER_OBJECT.idFromName('my-counter');
		const stub = env.COUNTER_OBJECT.get(id);

		if (request.headers.get('Upgrade') === 'websocket') {
			return await stub.fetch(request);
		}

		// 2. Otherwise, serve a simple interactive HTML dashboard
		const html = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Live Counter</title>
				<style>
					body { text-align: center }
					#counter { font-size: 5rem; color: #f0f }
					button { font-size: 1.5rem }
				</style>
			</head>
			<body>
				<h1>Live Global Counter 🚀</h1>
				<div id="counter">Connecting...</div>
				<button id="clickBtn">Increment</button>
				<script>(${counterClient.toString()})()</script>
			</body>
			</html>
        `;

		return new Response(html, {
			headers: { 'Content-Type': 'text/html;charset=UTF-8' },
		});
	},
} satisfies ExportedHandler<Env>;

export { CounterObject } from './CounterObject';
