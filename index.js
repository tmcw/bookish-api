const rateLimit = require("micro-ratelimit");
const { parse } = require("url");
const { parse: parseQuery } = require("querystring");
const { guess, collapseResults, methods } = require("./api");

module.exports = rateLimit(
  { window: 10000, limit: 100, headers: true },
  async req => {
    if (req.url === "/") {
      return { status: "ok" };
    }

    const { pathname, query } = parse(req.url);

    if (pathname === "/search") {
      const { id, type } = parseQuery(query);
      console.log(`search id=${id} type=${type}`);
      const method = methods.find(method => method.id === type);
      if (method) {
        return collapseResults(await method.resolve(id));
      }
      if (type === "guess") {
        return await guess(id);
      }
    }

    return "Route not found";
  }
);
