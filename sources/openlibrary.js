const got = require("got");
const _ = require("lodash");

// https://openlibrary.org/dev/docs/api/books
// TODO: handle 10 vs 13
class OpenLibrary {
  constructor(
    base = "https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys="
  ) {
    this.base = base;
  }
  async getType(type, val) {
    try {
      const url = `${this.base}${type}:${val}`;
      console.log(`openlibrary/request url=${url}`);
      console.time("openlibrary/request");
      let res = (await got(url, { json: true, timeout: 2000 })).body;
      console.timeEnd("openlibrary/request");
      let identifiers = _.property([`${type}:${val}`, "identifiers"])(res);
      identifiers.isbn10 = identifiers.isbn_10;
      delete identifiers.isbn_10;
      identifiers.isbn13 = identifiers.isbn_13;
      delete identifiers.isbn_13;
      return identifiers;
    } catch (e) {
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
