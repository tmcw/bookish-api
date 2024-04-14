import wae from "web-auto-extractor";

function get(obj, path) {
  for (let p of path) obj = obj && obj[p];
  return obj;
}

// TODO: handle 10 vs 13
export default class WorldCat {
  constructor(ctx, base = "https://www.worldcat.org") {
    this.base = base;
    this.ctx = ctx.prefix("worldcat");
  }
  async OCLC(oclc) {
    this.ctx.time("request");
    const url = `http://experiment.worldcat.org/oclc/${oclc}.jsonld`;
    this.ctx.log(`url=${url}`);
    let body;
    try {
      body = await fetch(url).then((r) => r.json());
    } catch (e) {
      this.ctx.log(`NOT FOUND`);
      return undefined;
    }
    this.ctx.timeEnd(`request`);
    const isbn = body["@graph"].find(
      (o) => o["@type"] === "schema:ProductModel",
    );
    const book = body["@graph"].find((o) =>
      [].concat(o["@type"]).includes("schema:CreativeWork"),
    );
    if (isbn) {
      return {
        isbn: isbn.isbn,
        permalinks: [isbn["@id"], book["@id"]],
      };
    }
  }
  async ISBN(id) {
    this.ctx.time("request");
    const url = `${this.base}/isbn/${id}`;
    this.ctx.log(`url=${url}`);
    let body;
    try {
      body = await fetch(url).then((r) => r.text());
    } catch (e) {
      this.ctx.log(`NOT FOUND`);
      return undefined;
    }
    const microdata = wae().parse(body);
    this.ctx.timeEnd(`request`);
    const title = get(microdata, ["rdfa", "Book", 0, "schema:name"]);
    const isbn = get(microdata, ["rdfa", "ProductModel", 0, "schema:isbn"]);
    const oclc = get(microdata, ["rdfa", "CreativeWork", 0, "library:oclcnum"]);
    return {
      isbn,
      title,
      oclc,
      permalinks: [url, `https://worldcat.org/oclc/${oclc}`],
    };
  }
}
