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

const ENDPOINT = API_PATH.projects;
const EXISTING_ID = 1;
const NONEXISTENT_ID = 99999;

describe("JSON /projects/:id", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return the project for a valid id", async function () {
      const res = await sendGet(`${ENDPOINT}/${EXISTING_ID}`);

      expect(res.status).to.equal(200);
      expect(res.data.projects).to.be.an("array").with.lengthOf(1);

      const project = res.data.projects[0];
      expect(project.id).to.equal("1");
      expect(project.title).to.equal("Office Work");
    });

    it("should return 404 for a nonexistent project id", async function () {
      const res = await sendGet(`${ENDPOINT}/${NONEXISTENT_ID}`);

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for an existing project", async function () {
      const res = await sendHead(`${ENDPOINT}/${EXISTING_ID}`);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for a nonexistent project", async function () {
      const res = await sendHead(`${ENDPOINT}/${NONEXISTENT_ID}`);
      expect(res.status).to.equal(404);
    });
  });

  // ── POST (amend) ──────────────────────────────────────────────
  describe("POST (amend)", function () {
    it("should update specific fields while preserving others", async function () {
      const res = await sendPost(`${ENDPOINT}/${EXISTING_ID}`, {
        description: "Updated via POST",
        active: true,
      });

      expect(res.status).to.equal(200);
      expect(res.data.description).to.equal("Updated via POST");
      expect(res.data.active).to.equal("true");
      expect(res.data.title).to.equal("Office Work");
    });

    it("should fail when amending a nonexistent project", async function () {
      const res = await sendPost(`${ENDPOINT}/${NONEXISTENT_ID}`, {
        description: "Ghost update",
      });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── PUT (replace) ─────────────────────────────────────────────
  describe("PUT (replace)", function () {
    it("should replace the project fields entirely", async function () {
      const res = await sendPut(`${ENDPOINT}/${EXISTING_ID}`, {
        title: "Replaced Title",
        active: true,
        description: "Fresh description",
      });

      expect(res.status).to.equal(200);
      expect(res.data.title).to.equal("Replaced Title");
      expect(res.data.active).to.equal("true");
      expect(res.data.description).to.equal("Fresh description");
    });

    it("should confirm PUT clears relationships (side effect check)", async function () {
      const res = await sendPut(`${ENDPOINT}/${EXISTING_ID}`, {
        title: "Wiped Relationships",
      });

      expect(res.status).to.equal(200);
      // PUT on this API clears task relationships
      expect(res.data).to.not.have.property("tasks");
    });

    it("should fail when replacing a nonexistent project", async function () {
      const res = await sendPut(`${ENDPOINT}/${NONEXISTENT_ID}`, {
        title: "Phantom",
      });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE ────────────────────────────────────────────────────
  describe("DELETE", function () {
    it("should delete an existing project and confirm removal", async function () {
      const deleteRes = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      expect(deleteRes.status).to.equal(200);

      const verifyRes = await sendGet(`${ENDPOINT}/${EXISTING_ID}`);
      expect(verifyRes.status).to.equal(404);
    });

    it("should return 404 when deleting a nonexistent project", async function () {
      const res = await sendDelete(`${ENDPOINT}/${NONEXISTENT_ID}`);

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });

    it("should return 404 when deleting the same project twice", async function () {
      await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);
      const secondAttempt = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);

      expect(secondAttempt.status).to.equal(404);
    });

    it("should not affect other projects when one is deleted", async function () {
      await sendPost(ENDPOINT, { title: "Survivor" });
      await sendDelete(`${ENDPOINT}/${EXISTING_ID}`);

      const allProjects = await sendGet(ENDPOINT);
      const titles = allProjects.data.projects.map((p) => p.title);

      expect(titles).to.include("Survivor");
      expect(titles).to.not.include("Office Work");
    });
  });
});
