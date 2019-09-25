const got = require("got");
const cheerio = require("cheerio");
const GOODREADS_KEY = "H0A4fmIW7WF2btmo1ACpw";
const getXML = async url =>
  cheerio.load((await got(url, { timeout: 2000 })).body, { xmlMode: true });

// https://www.goodreads.com/api/index#book.isbn_to_id
class GoodReads {
  constructor(ctx, base = "https://www.goodreads.com/book") {
    this.ctx = ctx.prefix("goodreads");
    this.base = base;
  }
  async ISBN(isbn) {
    try {
      this.ctx.time(`request`);
      const { body } = await got(
        `${this.base}/isbn_to_id/${isbn}?key=${GOODREADS_KEY}`
      );
      this.ctx.timeEnd(`request`);
      return {
        goodreads: [body],
        permalinks: [`https://goodreads.com/book/show/${body}`],
        ...(await this.GoodReads(body))
      };
    } catch (e) {
      console.log(e);
      this.ctx.log("NOT FOUND");
    }
  }
  async GoodReads(goodreads) {
    const url = `${this.base}/show/${goodreads}.json?key=${GOODREADS_KEY}`;
    this.ctx.time(`request`);
    this.ctx.log(`url=${url}`);
    const res = await getXML(url);
    this.ctx.timeEnd(`request`);
    const ids = {};
    ["isbn", "isbn13", "asin"].forEach(type => {
      const value = res(`GoodreadsResponse > book > ${type}`).text();
      if (value) ids[type] = [value];
    });
    ids.title = res(`GoodreadsResponse > book > title`).text();
    ids.authors = res(`GoodreadsResponse > book > authors > author > name`)
      .map((i, el) => cheerio(el).text())
      .get();
    return ids;
  }
}

module.exports = GoodReads;
