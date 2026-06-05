export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.url.endsWith('/favicon.ico')) return new Response('', { status: 404 });

		const id = env.COUNTER_OBJECT.idFromName('my-counter');
		const stub = env.COUNTER_OBJECT.get(id);
		const response = await stub.fetch(request);
		const count = await response.text();
		return new Response('Hello CF workers! You are visitor number: ' + count);
	},
} satisfies ExportedHandler<Env>;

export { CounterObject } from './CounterObject';
