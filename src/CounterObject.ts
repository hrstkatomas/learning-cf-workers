import { DurableObject } from 'cloudflare:workers';

export class CounterObject extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async fetch(request: Request): Promise<Response> {
		let count = (await this.ctx.storage.get<number>('count')) ?? 0;
		count++;
		await this.ctx.storage.put('count', count);
		return new Response(String(count));
	}
}
