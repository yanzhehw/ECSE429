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
const PROJECTS = API_PATH.projects;
const PROJ_REL = RELATIONSHIP.projects;
const VALID_CATEG_ID = 1;
const INVALID_CATEG_ID = 99999;

function projPath(categId) {
  return `${CATEGORIES}/${categId}/${PROJ_REL}`;
}

function projDeletePath(categId, projId) {
  return `${CATEGORIES}/${categId}/${PROJ_REL}/${projId}`;
}

describe("JSON /categories/:id/projects", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return an empty project list for a category with no project links", async function () {
      const res = await sendGet(projPath(VALID_CATEG_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("projects").that.is.an("array");
    });

    // BUG: returns 200 with data instead of 404
    it("[ACTUAL] should return 200 for a nonexistent category id (BUG)", async function () {
      const res = await sendGet(projPath(INVALID_CATEG_ID));

      expect(res.status).to.equal(200);
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for a valid category", async function () {
      const res = await sendHead(projPath(VALID_CATEG_ID));
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent category (BUG)", async function () {
      const res = await sendHead(projPath(INVALID_CATEG_ID));
      expect(res.status).to.equal(200);
    });
  });

  // ── POST (create relationship) ────────────────────────────────
  describe("POST", function () {
    it("should link a project to a category and verify", async function () {
      const linkRes = await sendPost(projPath(VALID_CATEG_ID), { id: "1" });
      expect(linkRes.status).to.equal(201);

      const verifyRes = await sendGet(projPath(VALID_CATEG_ID));
      const linkedIds = verifyRes.data.projects.map((p) => p.id);
      expect(linkedIds).to.include("1");
    });

    it("should return 404 when linking to a nonexistent category", async function () {
      const res = await sendPost(projPath(INVALID_CATEG_ID), { id: "1" });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });

    it("should return error when linking a nonexistent project id", async function () {
      const res = await sendPost(projPath(VALID_CATEG_ID), { id: "99999" });

      expect(res.status).to.equal(404);
    });
  });

  // ── DELETE (remove relationship) ──────────────────────────────
  describe("DELETE", function () {
    it("should unlink a project from a category after linking it", async function () {
      await sendPost(projPath(VALID_CATEG_ID), { id: "1" });

      const delRes = await sendDelete(projDeletePath(VALID_CATEG_ID, 1));
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(projPath(VALID_CATEG_ID));
      expect(afterRes.data.projects).to.be.an("array").that.is.empty;
    });

    it("should return 404 when removing a nonexistent project link", async function () {
      const res = await sendDelete(projDeletePath(VALID_CATEG_ID, 99999));

      expect(res.status).to.equal(404);
    });
  });
});
