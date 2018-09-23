const GoodReads = require("./goodreads");
const Context = require("../").Context;
const test = require("tap").test;

test("GoodReads", async t => {
  const ctx = new Context();
  const gr = new GoodReads(ctx);
  t.matchSnapshot(await gr.ISBN("0812993543"));
});
