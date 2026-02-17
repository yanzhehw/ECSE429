const { expect } = require("chai");
const {
  API_PATH,
  RELATIONSHIP,
  sendGet,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const TODOS = API_PATH.todos;
const CATEG_REL = RELATIONSHIP.categories;
const INVALID_TODO_ID = 99999;

function categPath(todoId) {
  return `${TODOS}/${todoId}/${CATEG_REL}`;
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED /todos/:id/categories – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("GET should return 404 when todo does not exist", async function () {
    // Documentation implies a nonexistent parent should yield 404.
    // Actual behavior: returns 200 and lists categories anyway.
    const res = await sendGet(categPath(INVALID_TODO_ID));

    expect(res.status).to.equal(404);
    expect(res.data).to.have.property("errorMessages");
  });

  it("HEAD should return 404 when todo does not exist", async function () {
    const res = await sendHead(categPath(INVALID_TODO_ID));

    expect(res.status).to.equal(404);
  });
});
