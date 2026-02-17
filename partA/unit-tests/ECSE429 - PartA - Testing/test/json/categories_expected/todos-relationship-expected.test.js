const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const CATEGORIES = API_PATH.categories;
const TODOS_REL = "todos";
const INVALID_CATEG_ID = 99999;

function todosPath(categId) {
  return `${CATEGORIES}/${categId}/${TODOS_REL}`;
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED /categories/:id/todos – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("GET should return 404 when category does not exist", async function () {
    const res = await sendGet(todosPath(INVALID_CATEG_ID));

    expect(res.status).to.equal(404);
    expect(res.data).to.have.property("errorMessages");
  });

  it("HEAD should return 404 when category does not exist", async function () {
    const res = await sendHead(todosPath(INVALID_CATEG_ID));

    expect(res.status).to.equal(404);
  });
});
