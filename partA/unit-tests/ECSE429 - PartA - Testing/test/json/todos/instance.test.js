const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendPost,
  sendPut,
  sendDelete,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const ENDPOINT = API_PATH.todos;
const EXISTING_ID = 1;
const NONEXISTENT_ID = 99999;

describe("JSON /todos/:id", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return a specific todo by valid id", async function () {
      const res = await sendGet(`${ENDPOINT}/${EXISTING_ID}`);

      expect(res.status).to.equal(200);
      expect(res.data.todos).to.be.an("array").with.lengthOf(1);
      expect(res.data.todos[0].id).to.equal("1");
      expect(res.data.todos[0].title).to.equal("scan paperwork");
    });

    it("should include relationship references in the response", async function () {
      const res = await sendGet(`${ENDPOINT}/${EXISTING_ID}`);
      const todo = res.data.todos[0];

      expect(todo).to.have.property("tasksof");
      expect(todo).to.have.property("categories");
    });

    it("should return 404 for a nonexistent todo id", async function () {
      const res = await sendGet(`${ENDPOINT}/${NONEXISTENT_ID}`);

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for an existing todo", async function () {
      const res = await sendHead(`${ENDPOINT}/${EXISTING_ID}`);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for a nonexistent todo", async function () {
      const res = await sendHead(`${ENDPOINT}/${NONEXISTENT_ID}`);
      expect(res.status).to.equal(404);
    });
  });

  // ── POST (amend) ──────────────────────────────────────────────
  describe("POST (amend)", function () {
    it("should update selected fields while keeping others intact", async function () {
      const res = await sendPost(`${ENDPOINT}/${EXISTING_ID}`, {
        doneStatus: true,
        description: "Scanning complete",
      });

      expect(res.status).to.equal(200);
      expect(res.data.doneStatus).to.equal("true");
      expect(res.data.description).to.equal("Scanning complete");
      expect(res.data.title).to.equal("scan paperwork");
    });

    it("should preserve relationships after amending", async function () {
      const res = await sendPost(`${ENDPOINT}/${EXISTING_ID}`, {
        description: "Still linked",
      });

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("tasksof");
      expect(res.data).to.have.property("categories");
    });

    it("should return 404 when amending a nonexistent todo", async function () {
      const res = await sendPost(`${ENDPOINT}/${NONEXISTENT_ID}`, {
        doneStatus: true,
      });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── PUT (replace) ─────────────────────────────────────────────
  describe("PUT (replace)", function () {
    it("should replace the entire todo resource", async function () {
      const res = await sendPut(`${ENDPOINT}/${EXISTING_ID}`, {
        title: "Completely replaced",
        doneStatus: true,
        description: "New description",
      });

      expect(res.status).to.equal(200);
      expect(res.data.title).to.equal("Completely replaced");
      expect(res.data.doneStatus).to.equal("true");
      expect(res.data.description).to.equal("New description");
    });

    it("should clear relationships after PUT (side effect verification)", async function () {
      const res = await sendPut(`${ENDPOINT}/${EXISTING_ID}`, {
        title: "Wiped clean",
      });

      expect(res.status).to.equal(200);
      expect(res.data).to.not.have.property("categories");
      expect(res.data).to.not.have.property("tasksof");
    });

    it("should return 404 when replacing a nonexistent todo", async function () {
      const res = await sendPut(`${ENDPOINT}/${NONEXISTENT_ID}`, {
        title: "Phantom todo",
      });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE ────────────────────────────────────────────────────
  describe("DELETE", function () {
    it("should delete an existing todo and confirm removal", async function () {
      const deleteRes = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      expect(deleteRes.status).to.equal(200);

      const verifyRes = await sendGet(`${ENDPOINT}/${EXISTING_ID}`);
      expect(verifyRes.status).to.equal(404);
    });

    it("should return 404 when deleting a nonexistent todo", async function () {
      const res = await sendDelete(`${ENDPOINT}/${NONEXISTENT_ID}`);

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });

    it("should return 404 when deleting the same todo twice", async function () {
      await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      const secondAttempt = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);

      expect(secondAttempt.status).to.equal(404);
    });

    it("should not remove other todos when one is deleted", async function () {
      await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      const remaining = await sendGet(ENDPOINT);

      expect(remaining.data.todos).to.have.lengthOf(1);
      expect(remaining.data.todos[0].title).to.equal("file paperwork");
    });
  });
});
