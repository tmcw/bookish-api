const wae = require("web-auto-extractor").default;
const got = require("got");

function get(obj, path) {
  for (let p of path) obj = obj && obj[p];
  return obj;
}

// TODO: handle 10 vs 13
class WorldCat {
  constructor(ctx, base = "https://www.worldcat.org") {
    this.base = base;
    this.ctx = ctx.prefix("worldcat");
  }
  async OCLC(oclc) {
    this.ctx.time("request");
    const url = `http://experiment.worldcat.org/oclc/${oclc}.jsonld`;
    this.ctx.log(`url=${url}`);
    const { body } = await got(url, { json: true });
    this.ctx.timeEnd(`request`);
    const isbn = body["@graph"].find(o => o["@type"] === "schema:ProductModel");
    if (isbn) {
      return {
        isbn: isbn.isbn
      };
    }
  }
  async ISBN(id) {
    this.ctx.time("request");
    const url = `${this.base}/isbn/${id}`;
    this.ctx.log(`url=${url}`);
    const { body } = await got(url);
    const microdata = wae().parse(body);
    this.ctx.timeEnd(`request`);
    return {
      isbn: get(microdata, ["rdfa", "ProductModel", 0, "schema:isbn"]),
      oclc: get(microdata, ["rdfa", "CreativeWork", 0, "library:oclcnum"])
    };
  }
}

module.exports = WorldCat;
