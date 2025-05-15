import { DurableObject } from 'cloudflare:workers';

interface EnvWithApiToken extends Env {
  API_TOKEN?: string;
  R2_TOKEN?: string;
  R2_ENDPOINT?: string;
  R2_CATALOG?: string;
}

export class Container extends DurableObject<EnvWithApiToken> {
  container: globalThis.Container;
  monitor?: Promise<unknown>;

  constructor(ctx: DurableObjectState, env: EnvWithApiToken) {
    super(ctx, env);
    this.container = ctx.container!;
    void this.ctx.blockConcurrencyWhile(async () => {
      const containerConfig: ContainerStartupOptions = {
        enableInternet: true,
      }
      // Add API token if provided
      if (this.env.API_TOKEN) {
        containerConfig.env = {
          API_TOKEN: this.env.API_TOKEN
        }
      }
      // Add R2 credentials if provided
      if (this.env.R2_TOKEN && this.env.R2_ENDPOINT && this.env.R2_CATALOG) {
        containerConfig.env = {
          R2_TOKEN: this.env.R2_TOKEN,
          R2_ENDPOINT: this.env.R2_ENDPOINT,
          R2_CATALOG: this.env.R2_CATALOG
        }
      }
      // Start container
      if (!this.container.running) this.container.start(containerConfig);
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
