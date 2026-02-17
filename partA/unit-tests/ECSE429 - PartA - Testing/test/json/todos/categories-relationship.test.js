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

const TODOS = API_PATH.todos;
const CATEGORIES = API_PATH.categories;
const CATEG_REL = RELATIONSHIP.categories;
const VALID_TODO_ID = 1;
const SECONDARY_TODO_ID = 2;
const INVALID_TODO_ID = 99999;

function categPath(todoId) {
  return `${TODOS}/${todoId}/${CATEG_REL}`;
}

function categDeletePath(todoId, categId) {
  return `${TODOS}/${todoId}/${CATEG_REL}/${categId}`;
}

describe("JSON /todos/:id/categories", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return categories linked to todo 1 (default: Office)", async function () {
      const res = await sendGet(categPath(VALID_TODO_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("categories").that.is.an("array");
      expect(res.data.categories).to.have.lengthOf(1);
      expect(res.data.categories[0].title).to.equal("Office");
    });

    // BUG: returns 200 with data instead of 404
    it("[ACTUAL] should return 200 for a nonexistent todo id (BUG)", async function () {
      const res = await sendGet(categPath(INVALID_TODO_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("categories").that.is.an("array");
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for a valid todo", async function () {
      const res = await sendHead(categPath(VALID_TODO_ID));
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent todo (BUG)", async function () {
      const res = await sendHead(categPath(INVALID_TODO_ID));
      expect(res.status).to.equal(200);
    });
  });

  // ── POST (create relationship) ────────────────────────────────
  describe("POST", function () {
    it("should link a category to a todo and verify via GET", async function () {
      const linkRes = await sendPost(categPath(SECONDARY_TODO_ID), { id: "2" });
      expect(linkRes.status).to.equal(201);

      const verifyRes = await sendGet(categPath(SECONDARY_TODO_ID));
      const linkedIds = verifyRes.data.categories.map((c) => c.id);
      expect(linkedIds).to.include("2");
    });

    it("should return 404 when linking to a nonexistent todo", async function () {
      const res = await sendPost(categPath(INVALID_TODO_ID), { id: "1" });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE (remove relationship) ──────────────────────────────
  describe("DELETE", function () {
    it("should unlink a category from a todo and confirm removal", async function () {
      const delRes = await sendDelete(categDeletePath(VALID_TODO_ID, 1));
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(categPath(VALID_TODO_ID));
      expect(afterRes.data.categories).to.be.an("array").that.is.empty;
    });

    it("should return 404 when removing a relationship that was already deleted", async function () {
      await sendDelete(categDeletePath(VALID_TODO_ID, 1));
      const secondAttempt = await sendDelete(categDeletePath(VALID_TODO_ID, 1));

      expect(secondAttempt.status).to.equal(404);
      expect(secondAttempt.data.errorMessages).to.be.an("array").that.is.not.empty;
    });

    it("should return 404 when removing a nonexistent category link", async function () {
      const res = await sendDelete(categDeletePath(VALID_TODO_ID, 99999));

      expect(res.status).to.equal(404);
    });
  });
});
