const WorldCat = require("./worldcat");
const Context = require("../").Context;
const test = require("tap").test;

test("WorldCat", async t => {
  const ctx = new Context();
  const wc = new WorldCat(ctx);
  t.matchSnapshot(await wc.ISBN("0812993543"));
});
