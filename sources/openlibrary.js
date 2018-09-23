const got = require("got");
const _ = require("lodash");

// https://openlibrary.org/dev/docs/api/books
// TODO: handle 10 vs 13
class OpenLibrary {
  constructor(ctx, 
    base = "https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys="
  ) {
    this.ctx = ctx;
    this.base = base;
  }
  async getType(type, val) {
    try {
      const url = `${this.base}${type}:${val}`;
      let before = Date.now();
      this.ctx.log(`url=${url}`);
      let res = (await got(url, { json: true, timeout: 2000 })).body;
      this.ctx.log(`url=${url} ${Date.now() - before}ms`);
      let identifiers = _.property([`${type}:${val}`, "identifiers"])(res);
      identifiers.isbn = identifiers.isbn_10;
      delete identifiers.isbn_10;
      identifiers.isbn13 = identifiers.isbn_13;
      delete identifiers.isbn_13;
      return identifiers;
    } catch (e) {
      console.log(e);
      this.ctx.log(`NOT FOUND on OpenLibrary (request code ${e.status})`);
      return null;
    }
  }
  async ISBN(isbn) {
    return await this.getType("ISBN", isbn);
  }
  async LCCN(lccn) {
    return await this.getType("LCCN", lccn);
  }
  async OLID(openlibrary) {
    return await this.getType("OLID", openlibrary);
  }
  async OCLC(oclc) {
    return await this.getType("OCLC", oclc);
  }
}

module.exports = OpenLibrary;
