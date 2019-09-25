const { parse } = require("url");
const { parse: parseQuery } = require("querystring");
const { guess, collapseResults, methods } = require("../api.js");
const Context = require("../context.js");
const makeSources = require("../sources/index.js");

async function handler(req) {
  const { pathname, query } = parse(req.url);
  const { id, type } = parseQuery(query);
  if (!id || !type) {
    return { error: "Bad request" };
  }
  const ctx = new Context();
  const sources = makeSources(ctx);
  const method = methods.find(method => method.id === type);
  if (method) {
    ctx.time(`overall id=${id} type=${type}`);
    const results = await method.resolve(ctx, id, sources);
    ctx.timeEnd(`overall id=${id} type=${type}`);
    const { ids, permalinks } = collapseResults(results);
    return {
      messages: ctx.getMessages(),
      results: ids,
      permalinks
    };
  }
  if (type === "guess") {
    return await guess(ctx, id);
  }
}

module.exports = handler;