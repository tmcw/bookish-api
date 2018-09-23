const GoodReads = require("./goodreads.js");
const OpenLibrary = require("./openlibrary.js");
const WorldCat = require("./worldcat.js");

module.exports = function makeSources(ctx) {
  return {
    goodReads: new GoodReads(ctx),
    openLibrary: new OpenLibrary(ctx),
    worldCat: new WorldCat(ctx)
  };
};
