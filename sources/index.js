import GoodReads from "./goodreads.js";
import OpenLibrary from "./openlibrary.js";
import WorldCat from "./worldcat.js";

export default function makeSources(ctx) {
  return {
    goodReads: new GoodReads(ctx),
    openLibrary: new OpenLibrary(ctx),
    worldCat: new WorldCat(ctx),
  };
}
