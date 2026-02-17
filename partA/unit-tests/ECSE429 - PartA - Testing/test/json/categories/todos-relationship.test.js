const { expect } = require("chai");
const {
  API_PATH,
  RELATIONSHIP,
  sendGet,
  sendPost,
  sendDelete,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const CATEGORIES = API_PATH.categories;
const TODOS = API_PATH.todos;
const TODOS_REL = "todos";
const VALID_CATEG_ID = 1;
const INVALID_CATEG_ID = 99999;

function todosPath(categId) {
  return `${CATEGORIES}/${categId}/${TODOS_REL}`;
}

function todosDeletePath(categId, todoId) {
  return `${CATEGORIES}/${categId}/${TODOS_REL}/${todoId}`;
}

describe("JSON /categories/:id/todos", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return todos linked to category 1 after linking", async function () {
      await sendPost(todosPath(VALID_CATEG_ID), { id: "1" });
      const res = await sendGet(todosPath(VALID_CATEG_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("todos").that.is.an("array");
      expect(res.data.todos.length).to.be.at.least(1);
    });

    // BUG: returns 200 with data instead of 404
    it("[ACTUAL] should return 200 for a nonexistent category id (BUG)", async function () {
      const res = await sendGet(todosPath(INVALID_CATEG_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("todos").that.is.an("array");
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for a valid category", async function () {
      const res = await sendHead(todosPath(VALID_CATEG_ID));
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent category (BUG)", async function () {
      const res = await sendHead(todosPath(INVALID_CATEG_ID));
      expect(res.status).to.equal(200);
    });
  });

  // ── POST (create relationship) ────────────────────────────────
  describe("POST", function () {
    it("should link a todo to a category and verify via GET", async function () {
      const linkRes = await sendPost(todosPath(VALID_CATEG_ID), { id: "2" });
      expect(linkRes.status).to.equal(201);

      const verifyRes = await sendGet(todosPath(VALID_CATEG_ID));
      const linkedIds = verifyRes.data.todos.map((t) => t.id);
      expect(linkedIds).to.include("2");
    });

    it("should return 404 when linking to a nonexistent category", async function () {
      const res = await sendPost(todosPath(INVALID_CATEG_ID), { id: "1" });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE (remove relationship) ──────────────────────────────
  describe("DELETE", function () {
    it("should unlink a todo from a category and confirm removal", async function () {
      await sendPost(todosPath(VALID_CATEG_ID), { id: "1" });

      const delRes = await sendDelete(todosDeletePath(VALID_CATEG_ID, 1));
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(todosPath(VALID_CATEG_ID));
      const remainingIds = afterRes.data.todos.map((t) => t.id);
      expect(remainingIds).to.not.include("1");
    });

    it("should return 404 when unlinking a nonexistent todo", async function () {
      const res = await sendDelete(todosDeletePath(VALID_CATEG_ID, 99999));

      expect(res.status).to.equal(404);
    });
  });
});
