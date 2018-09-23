var WorldCat = require("./worldcat");

test("WorldCat", async () => {
  const wc = new WorldCat();
  expect(wc).toBeTruthy();
  expect(await wc.ISBN("0812993543")).toMatchSnapshot();
});
