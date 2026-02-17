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

const PROJECTS = API_PATH.projects;
const CATEGORIES = API_PATH.categories;
const CATEG_REL = RELATIONSHIP.categories;
const VALID_PROJECT_ID = 1;
const INVALID_PROJECT_ID = 99999;

function categPath(projectId) {
  return `${PROJECTS}/${projectId}/${CATEG_REL}`;
}

function categDeletePath(projectId, categId) {
  return `${PROJECTS}/${projectId}/${CATEG_REL}/${categId}`;
}

describe("JSON /projects/:id/categories", function () {
  beforeEach(async function () {
    await startServer();
    // Establish a baseline relationship for tests
    await sendPost(categPath(VALID_PROJECT_ID), { id: "1" });
  });
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return categories linked to an existing project", async function () {
      const res = await sendGet(categPath(VALID_PROJECT_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("categories").that.is.an("array");
      expect(res.data.categories.length).to.be.at.least(1);

      const office = res.data.categories.find((c) => c.id === "1");
      expect(office).to.exist;
      expect(office.title).to.equal("Office");
    });

    // BUG: returns 200 with data instead of 404
    it("[ACTUAL] should return 200 for a nonexistent project id (BUG)", async function () {
      const res = await sendGet(categPath(INVALID_PROJECT_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("categories").that.is.an("array");
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for a valid project", async function () {
      const res = await sendHead(categPath(VALID_PROJECT_ID));
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent project (BUG)", async function () {
      const res = await sendHead(categPath(INVALID_PROJECT_ID));
      expect(res.status).to.equal(200);
    });
  });

  // ── POST (create relationship) ────────────────────────────────
  describe("POST", function () {
    it("should link an additional category to the project", async function () {
      const linkRes = await sendPost(categPath(VALID_PROJECT_ID), { id: "2" });
      expect(linkRes.status).to.equal(201);

      const verifyRes = await sendGet(categPath(VALID_PROJECT_ID));
      const linkedIds = verifyRes.data.categories.map((c) => c.id);
      expect(linkedIds).to.include("1");
      expect(linkedIds).to.include("2");
    });

    it("should return 404 when linking to a nonexistent project", async function () {
      const res = await sendPost(categPath(INVALID_PROJECT_ID), { id: "1" });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE (remove relationship) ──────────────────────────────
  describe("DELETE", function () {
    it("should unlink a category from a project and verify removal", async function () {
      const delRes = await sendDelete(categDeletePath(VALID_PROJECT_ID, 1));
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(categPath(VALID_PROJECT_ID));
      expect(afterRes.data.categories).to.be.an("array").that.is.empty;
    });

    it("should return 404 when removing a nonexistent relationship", async function () {
      const res = await sendDelete(categDeletePath(VALID_PROJECT_ID, 99999));

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });
});
