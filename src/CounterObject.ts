import { DurableObject } from 'cloudflare:workers';

export class CounterObject extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async fetch(request: Request): Promise<Response> {
		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);

		// Hand the server end to Cloudflare's Hibernation system
		this.ctx.acceptWebSocket(server);

		// Send the current count to this new connection
		let count = (await this.ctx.storage.get<number>('count')) ?? 0;
		server.send(String(count));

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
		if (message === 'increment') {
			let count = (await this.ctx.storage.get<number>('count')) ?? 0;
			count++;
			await this.ctx.storage.put('count', count);

			const allConnections = this.ctx.getWebSockets();
			for (const connection of allConnections) {
				connection.send(String(count));
			}
		}
	}
}
