var GoodReads = require("./goodreads");

test("GoodReads", async () => {
  const gr = new GoodReads();
  expect(gr).toBeTruthy();
  expect(await gr.ISBN("0812993543")).toMatchSnapshot();
});
