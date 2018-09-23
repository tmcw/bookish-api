/*
 * TODO
 *
 * - viaf identifiers?
 * - write back to openlibrary whenever someone queries for a book?
 */
const GoodReads = require("./sources/goodreads");
const OpenLibrary = require("./sources/openlibrary");
const WorldCat = require("./sources/worldcat");
const guess = require("./guess");

const methods = [
  {
    id: "isbn",
    name: "International Standard Book Number",
    example: "0140098682",
    resolve: async (context, id) => {
      const goodReads = new GoodReads(context);
      const openLibrary = new OpenLibrary(context);
      const worldCat = new WorldCat(context);
      const [openlibrary, goodreads, worldcat] = await Promise.all([
        openLibrary.ISBN(id),
        goodReads.ISBN(id),
        worldCat.ISBN(id)
      ]);
      return {
        openlibrary,
        goodreads,
        worldcat
      };
    }
  },
  {
    id: "oclc",
    name: "Ohio College Library Center",
    url: id => `http://www.worldcat.org/oclc/${id}?tab=details`,
    example: "956478923",
    resolve: async (context, id) => {
      const openLibrary = new OpenLibrary(context);
      const worldCat = new WorldCat(context);
      return {
        openlibrary: await openLibrary.OCLC(id),
        worldcat: await worldCat.OCLC(id)
      };
    }
  },
  {
    id: "olid",
    name: "OpenLibrary ID",
    url: id => `https://openlibrary.org/books/${id}`,
    example: "OL794799M",
    resolve: async (context, id) => {
      return {
        openlibrary: await openLibrary.OLID(id)
      };
    }
  },
  {
    id: "lccn",
    name: "Library of Congress Control Number",
    url: id => `http://lccn.loc.gov/${id}`,
    example: "95030619",
    resolve: async (context, id) => {
      return {
        openlibrary: await openLibrary.LCCN(id)
      };
    }
  },
  {
    id: "goodreads",
    name: "GoodReads ID",
    url: id => `https://www.goodreads.com/book/show/${id}`,
    example: "544063",
    resolve: async (context, id) => {
      let g = await goodReads.GoodReads(id);
      if (g.isbn && g.isbn.length) {
        let isbn = g.isbn[0];
        return {
          data: {
            openlibrary: await openLibrary.ISBN(isbn),
            goodreads: await goodReads.ISBN(isbn),
            worldcat: await worldCat.ISBN(isbn)
          }
        };
      }
      return {
        data: {
          goodreads: g
        }
      };
    }
  }
];

function collapseResults(results) {
  let ids = {};
  for (let source in results) {
    for (let id in results[source]) {
      ids[id] = (ids[id] || []).concat(results[source][id]);
    }
  }
  // TODO: note provenance
  for (let id in ids) {
    ids[id] = [...new Set(ids[id].filter(Boolean))];
  }
  return ids;
}

module.exports.guess = guess;
module.exports.methods = methods;
module.exports.collapseResults = collapseResults;
