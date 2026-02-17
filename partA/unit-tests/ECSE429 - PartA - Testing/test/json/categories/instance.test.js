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

const ENDPOINT = API_PATH.categories;
const EXISTING_ID = 1;
const NONEXISTENT_ID = 99999;

describe("JSON /categories/:id", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return a specific category by valid id", async function () {
      const res = await sendGet(`${ENDPOINT}/${EXISTING_ID}`);

      expect(res.status).to.equal(200);
      expect(res.data.categories).to.be.an("array").with.lengthOf(1);
      expect(res.data.categories[0].id).to.equal("1");
      expect(res.data.categories[0].title).to.equal("Office");
    });

    it("should return 404 for a nonexistent category id", async function () {
      const res = await sendGet(`${ENDPOINT}/${NONEXISTENT_ID}`);

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for an existing category", async function () {
      const res = await sendHead(`${ENDPOINT}/${EXISTING_ID}`);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for a nonexistent category", async function () {
      const res = await sendHead(`${ENDPOINT}/${NONEXISTENT_ID}`);
      expect(res.status).to.equal(404);
    });
  });

  // ── POST (amend) ──────────────────────────────────────────────
  describe("POST (amend)", function () {
    it("should update description while preserving the title", async function () {
      const res = await sendPost(`${ENDPOINT}/${EXISTING_ID}`, {
        description: "Corporate tasks",
      });

      expect(res.status).to.equal(200);
      expect(res.data.description).to.equal("Corporate tasks");
      expect(res.data.title).to.equal("Office");
    });

    it("should return 404 when amending a nonexistent category", async function () {
      const res = await sendPost(`${ENDPOINT}/${NONEXISTENT_ID}`, {
        title: "Phantom",
      });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── PUT (replace) ─────────────────────────────────────────────
  describe("PUT (replace)", function () {
    it("should replace all category fields", async function () {
      const res = await sendPut(`${ENDPOINT}/${EXISTING_ID}`, {
        title: "Workplace",
        description: "All workplace tasks",
      });

      expect(res.status).to.equal(200);
      expect(res.data.title).to.equal("Workplace");
      expect(res.data.description).to.equal("All workplace tasks");
    });

    it("should return 404 when replacing a nonexistent category", async function () {
      const res = await sendPut(`${ENDPOINT}/${NONEXISTENT_ID}`, {
        title: "Ghost",
      });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE ────────────────────────────────────────────────────
  describe("DELETE", function () {
    it("should delete a category and confirm it is gone", async function () {
      const delRes = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      expect(delRes.status).to.equal(200);

      const verifyRes = await sendGet(`${ENDPOINT}/${EXISTING_ID}`);
      expect(verifyRes.status).to.equal(404);
    });

    it("should return 404 when deleting a nonexistent category", async function () {
      const res = await sendDelete(`${ENDPOINT}/${NONEXISTENT_ID}`);

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });

    it("should return 404 when deleting the same category twice", async function () {
      await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      const secondAttempt = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);

      expect(secondAttempt.status).to.equal(404);
    });

    it("should not affect other categories when one is deleted", async function () {
      await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      const remaining = await sendGet(ENDPOINT);

      expect(remaining.data.categories).to.have.lengthOf(1);
      expect(remaining.data.categories[0].title).to.equal("Home");
    });
  });
});
