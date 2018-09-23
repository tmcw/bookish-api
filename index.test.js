const handler = require("./");
const micro = require("micro");
const listen = require("test-listen");
const got = require("got");

let service;
let url;

beforeAll(async () => {
  service = micro(handler);
  url = await listen(service);
});

afterAll(() => {
  service.close();
});

test("/", async () => {
  expect((await got(url, { json: true })).body).toMatchSnapshot();
});

test("isbn", async () => {
  expect(
    (await got(`${url}/search?type=isbn&id=9780812993547`, { json: true })).body
  ).toMatchSnapshot();
});

test("olid", async () => {
  expect(
    (await got(`${url}/search?type=olid&id=OL25773328M`, { json: true })).body
  ).toMatchSnapshot();
});

test("lccn", async () => {
  expect(
    (await got(`${url}/search?type=lccn&id=2015008120`, { json: true })).body
  ).toMatchSnapshot();
});
