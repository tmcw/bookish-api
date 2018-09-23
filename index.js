const rateLimit = require("micro-ratelimit");
const { parse } = require("url");
const { parse: parseQuery } = require("querystring");
const { guess, collapseResults, methods } = require("./api");

class Context {
  constructor(messages = [], prefix = "") {
    this.messages = messages;
    this.timers = new Map();
    this.pfx = prefix;
  }
  prefix(pfx) {
    return new Context(this.messages, pfx);
  }
  log(msg) {
    this.messages.push(`${new Date().toISOString()} ${this.pfx} ${msg}`);
  }
  time(msg) {
    this.timers.set(msg, Date.now());
  }
  timeEnd(msg) {
    const before = this.timers.get(msg);
    if (!before) {
      console.error(`Timer not found for ${msg}`);
    }
    this.log(`${msg} (${Date.now() - before}ms)`);
    this.timers.delete(msg);
  }
  getMessages() {
    if (this.timers.size) {
      console.error(`Stray timers detected: ${Array.from(timers.keys())}`);
    }
    return this.messages;
  }
}

async function handler(req) {
  if (req.url === "/") {
    return { status: "ok" };
  }

  const { pathname, query } = parse(req.url);

  if (pathname === "/search") {
    const ctx = new Context();
    const { id, type } = parseQuery(query);
    ctx.log(`START id=${id} type=${type}`);
    const method = methods.find(method => method.id === type);
    if (method) {
      return {
        messages: ctx.getMessages(),
        results: collapseResults(await method.resolve(ctx, id))
      };
    }
    if (type === "guess") {
      return await guess(ctx, id);
    }
  }

  return "Route not found";
}

module.exports = rateLimit(
  { window: 10000, limit: 100, headers: true },
  handler
);

module.exports.handler = handler;
module.exports.Context = Context;
