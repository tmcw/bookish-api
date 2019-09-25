const got = require("got");

// https://openlibrary.org/dev/docs/api/books
//
// OpenLibrary, somewhat confusingly, doesn't return a 404 for unknown resources.
// Instead, it just returns {}.
//
// TODO: handle 10 vs 13
class OpenLibrary {
  constructor(
    ctx,
    base = "https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys="
  ) {
    this.ctx = ctx.prefix("openlibrary");
    this.base = base;
  }
  async getType(type, val) {
    try {
      const url = `${this.base}${type}:${val}`;
      let before = Date.now();
      this.ctx.log(`url=${url}`);
      this.ctx.time("request");
      let { body } = await got(url, { json: true, timeout: 2000 });
      this.ctx.timeEnd("request");

      if (!Object.keys(body).length) {
        this.ctx.log("NOT FOUND");
        return null;
      }
      const {
        identifiers: { isbn_13, isbn_10, lccn, oclc, openlibrary },
        title,
        authors
      } = body[`${type}:${val}`];

      return {
        isbn: [].concat(isbn_13).concat(isbn_10),
        lccn,
        title,
        authors: authors.map(a => a.name),
        oclc,
        openlibrary,
        permalinks: [`https://openlibrary.org/books/${openlibrary}`]
      };
    } catch (e) {
      this.ctx.log(`ERROR`);
      return null;
    }
  }
  async ISBN(isbn) {
    return this.getType("ISBN", isbn);
  }
  async LCCN(lccn) {
    return this.getType("LCCN", lccn);
  }
  async OLID(openlibrary) {
    return this.getType("OLID", openlibrary);
  }
  async OCLC(oclc) {
    return this.getType("OCLC", oclc);
  }
}

module.exports = OpenLibrary;
