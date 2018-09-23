var OpenLibrary = require("./openlibrary");

test("OpenLibrary", async () => {
  const ol = new OpenLibrary();
  expect(ol).toBeTruthy();
  expect(await ol.ISBN("0812993543")).toMatchSnapshot();
});
