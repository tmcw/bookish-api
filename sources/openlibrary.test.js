const OpenLibrary = require("./openlibrary");
const Context = require("../").Context;
const test = require("tap").test;

test("OpenLibrary", async t => {
  const ctx = new Context();
  const ol = new OpenLibrary(ctx);
  t.matchSnapshot(await ol.ISBN("0812993543"));
});
