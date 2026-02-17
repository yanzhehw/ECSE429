const { expect } = require("chai");
const axios = require("axios");
const {
  API_PATH,
  BASE_URL,
  xmlHeaders,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const CATEGORIES = API_PATH.categories;
const TODOS_REL = "todos";
const VALID_CATEG_ID = 1;
const INVALID_CATEG_ID = 99999;

function todosPath(categId) {
  return `${CATEGORIES}/${categId}/${TODOS_REL}`;
}

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED XML /categories/:id/todos – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("HEAD should return 404 when category does not exist", async function () {
    const res = await sendHead(todosPath(INVALID_CATEG_ID), xmlHeaders);

    expect(res.status).to.equal(404);
  });

  it("POST should return 201 when creating a relationship via XML", async function () {
    const body = "<id>2</id>";
    const res = await xmlPost(todosPath(VALID_CATEG_ID), body);

    expect(res.status).to.equal(201);
  });

  it("POST should return 404 for nonexistent category with XML body", async function () {
    const body = "<id>1</id>";
    const res = await xmlPost(todosPath(INVALID_CATEG_ID), body);

    expect(res.status).to.equal(404);
  });
});
