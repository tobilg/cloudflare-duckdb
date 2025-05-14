import { DurableObject } from 'cloudflare:workers';

export class Container extends DurableObject<Env> {
	container: globalThis.Container;
	monitor?: Promise<unknown>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.container = ctx.container!;
		void this.ctx.blockConcurrencyWhile(async () => {
			if (!this.container.running) this.container.start({ enableInternet: true });
      this.monitor = this.container.monitor().then(() => console.log('Container exited?'));
		});
	}

	async fetch(req: Request) {
		try {
			return await this.container.getTcpPort(3000).fetch(req.url.replace('https:', 'http:'), req);
		} catch (err: unknown) {
			if (err instanceof Error) {
				return new Response(`${this.ctx.id.toString()}: ${err.message}`, { status: 500 });
			}
			return new Response(`${this.ctx.id.toString()}: Unknown error`, { status: 500 });
		}
	}
}

export default {
	async fetch(request, env): Promise<Response> {
		try {
			return await env.CONTAINER.get(env.CONTAINER.idFromName('cloudflare-duckdb')).fetch(request);
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error('Error fetch:', err.message);
				return new Response(err.message, { status: 500 });
			}
			return new Response('Unknown error', { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
