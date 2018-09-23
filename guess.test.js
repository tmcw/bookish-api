const test = require("tap").test;
const guess = require("./guess");

test("simple cases", t => {
  t.equal(guess("OL44998W"), "OLID");
  t.equal(guess("9780062368751"), "ISBN");
  t.equal(guess("0349141924"), "ISBN");
});
