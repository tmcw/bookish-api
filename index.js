const rateLimit = require("micro-ratelimit");
const { parse } = require("url");
const { parse: parseQuery } = require("querystring");
const { guess, collapseResults, methods } = require("./api");

class Context {
  constructor() {
    this.messages = [];
  }
  log(msg) {
    let formatted = `${(new Date()).toISOString()} ${msg}`;
    console.log(formatted);
    this.messages.push(formatted);
  }
}

module.exports = rateLimit(
  { window: 10000, limit: 100, headers: true },
  async req => {
    if (req.url === "/") {
      return { status: "ok" };
    }

    const { pathname, query } = parse(req.url);

    if (pathname === "/search") {
      const ctx = new Context();
      const { id, type } = parseQuery(query);
      console.log(`search id=${id} type=${type}`);
      const method = methods.find(method => method.id === type);
      if (method) {
        return {
          messages: ctx.messages,
          results: collapseResults(await method.resolve(ctx, id))
        }
      }
      if (type === "guess") {
        return await guess(ctx, id);
      }
    }

    return "Route not found";
  }
);
