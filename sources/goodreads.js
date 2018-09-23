const got = require("got");
const cheerio = require("cheerio");
const GOODREADS_KEY = "H0A4fmIW7WF2btmo1ACpw";
const getXML = async url =>
  cheerio.load((await got(url, { timeout: 2000 })).body, { xmlMode: true });

// https://www.goodreads.com/api/index#book.isbn_to_id
class GoodReads {
  constructor(ctx, base = "https://www.goodreads.com/book") {
    this.ctx = ctx;
    this.base = base;
  }
  async ISBN(isbn) {
    const { body } = await got(
      `${this.base}/isbn_to_id/${isbn}?key=${GOODREADS_KEY}`
    );
    return {
      goodreads: [body]
    };
  }
  async GoodReads(goodreads) {
    const url = `${this.base}/show/${goodreads}.json?key=${GOODREADS_KEY}`;
    const before = Date.now();
    const res = await getXML(url);
    this.ctx.log(`goodreads/request in ${Date.now() - before}ms`);
    const ids = {};
    ["isbn", "isbn13", "asin"].forEach(
      (type) => {
        const value = res(`GoodreadsResponse > book > ${type}`).text();
        if (value) ids[type] = [value];
      }
    );
    return ids;
  }
}

module.exports = GoodReads;
