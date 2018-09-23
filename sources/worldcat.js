const wae = require("web-auto-extractor").default;
const got = require("got");
const _ = require("lodash");

// TODO: handle 10 vs 13
class WorldCat {
  constructor(base = "https://www.worldcat.org") {
    this.base = base;
  }
  async get(type, id) {
    console.log('worldcat/request');
    console.time('worldcat/request');
    const { body } = await got(`${this.base}/${type}/${id}`);
    const microdata = wae().parse(body);
    console.timeEnd('worldcat/request');
    console.log('worldcat/parse');
    // TODO: how else could this data be shaped?
    return {
      isbn10: _.property(["rdfa", "ProductModel", 0, "schema:isbn"])(
        microdata
      ).filter(id => id.length == 10),
      isbn13: _.property(["rdfa", "ProductModel", 0, "schema:isbn"])(
        microdata
      ).filter(id => id.length == 13),
      oclc: _.property(["rdfa", "CreativeWork", 0, "library:oclcnum"])(
        microdata
      )
    };
  }
  async OCLC(oclc) {
    return await this.get("oclc", oclc);
  }
  async ISBN(isbn) {
    return await this.get("isbn", isbn);
  }
}

module.exports = WorldCat;
