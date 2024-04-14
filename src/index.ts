/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const { guess, collapseResults, methods } = require("../api.js");
const Context = require("../context.js");
const makeSources = require("../sources/index.js");

export default {
  async fetch(
    req: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const u = new URL(req.url);
    const id = u.searchParams.get("id");
    const type = u.searchParams.get("type");
    if (!id || !type) {
      return Response.json({ error: "Bad request" });
    }
    const ctx = new Context();
    const sources = makeSources(ctx);
    const method = methods.find(method => method.id === type);
    if (method) {
      ctx.time(`overall id=${id} type=${type}`);
      const results = await method.resolve(ctx, id, sources);
      ctx.timeEnd(`overall id=${id} type=${type}`);
      const { ids, permalinks } = collapseResults(results);
      return Response.json({
        messages: ctx.getMessages(),
        results: ids,
        permalinks
      });
    }
    if (type === "guess") {
      return Response.json(await guess(ctx, id));
    }
  }
};
