const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendPost,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const ENDPOINT = API_PATH.projects;

describe("JSON /projects", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should retrieve the default project list", async function () {
      const res = await sendGet(ENDPOINT);

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("projects").that.is.an("array");
      expect(res.data.projects.length).to.be.at.least(1);

      const defaultProject = res.data.projects.find((p) => p.id === "1");
      expect(defaultProject).to.exist;
      expect(defaultProject.title).to.equal("Office Work");
      expect(defaultProject.completed).to.equal("false");
      expect(defaultProject.active).to.equal("false");
    });

    it("should confirm no unexpected projects exist on fresh start", async function () {
      const res = await sendGet(ENDPOINT);

      expect(res.status).to.equal(200);
      expect(res.data.projects).to.have.lengthOf(1);
    });
  });

  // ── GET with query filters ────────────────────────────────────
  describe("GET with filters", function () {
    it("should filter projects by active status", async function () {
      await sendPost(ENDPOINT, { title: "Active One", active: true });
      const res = await sendGet(`${ENDPOINT}?active=true`);

      expect(res.status).to.equal(200);
      res.data.projects.forEach((p) => {
        expect(p.active).to.equal("true");
      });
    });

    it("should filter projects by completed status", async function () {
      const res = await sendGet(`${ENDPOINT}?completed=false`);

      expect(res.status).to.equal(200);
      expect(res.data.projects.length).to.be.at.least(1);
      res.data.projects.forEach((p) => {
        expect(p.completed).to.equal("false");
      });
    });

    it("should return empty list when filter matches nothing", async function () {
      const res = await sendGet(`${ENDPOINT}?title=nonexistent_project_xyz`);

      expect(res.status).to.equal(200);
      expect(res.data.projects).to.be.an("array").that.is.empty;
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 with headers but no body", async function () {
      const res = await sendHead(ENDPOINT);

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });

  // ── POST ───────────────────────────────────────────────────────
  describe("POST", function () {
    it("should create a new project with only required fields", async function () {
      const payload = { title: "Capstone Project" };
      const res = await sendPost(ENDPOINT, payload);

      expect(res.status).to.equal(201);
      expect(res.data.title).to.equal("Capstone Project");
      expect(res.data.completed).to.equal("false");
      expect(res.data.active).to.equal("false");
      expect(res.data.description).to.equal("");
      expect(res.data).to.have.property("id");
    });

    it("should create a project with all optional fields", async function () {
      const payload = {
        title: "Research Lab",
        completed: false,
        active: true,
        description: "ML research tasks",
      };
      const res = await sendPost(ENDPOINT, payload);

      expect(res.status).to.equal(201);
      expect(res.data.title).to.equal("Research Lab");
      expect(res.data.active).to.equal("true");
      expect(res.data.description).to.equal("ML research tasks");
    });

    it("should verify newly created project appears in GET list", async function () {
      await sendPost(ENDPOINT, { title: "Side Effects Check" });
      const res = await sendGet(ENDPOINT);

      const titles = res.data.projects.map((p) => p.title);
      expect(titles).to.include("Side Effects Check");
      expect(res.data.projects.length).to.equal(2);
    });

    it("should reject a project with invalid boolean for active", async function () {
      const payload = {
        title: "Bad Project",
        active: "yes",
      };
      const res = await sendPost(ENDPOINT, payload);

      expect(res.status).to.equal(400);
      expect(res.data.errorMessages[0]).to.include("active");
      expect(res.data.errorMessages[0]).to.include("BOOLEAN");
    });

    it("should reject malformed JSON payload", async function () {
      const res = await sendPost(ENDPOINT, '{"title": "missing quote}');

      expect(res.status).to.equal(400);
    });

    it("should reject a payload with an unrecognized field", async function () {
      const payload = {
        title: "Extra Fields",
        priority: "high",
      };
      const res = await sendPost(ENDPOINT, payload);

      expect(res.status).to.equal(400);
      expect(res.data.errorMessages[0]).to.include("priority");
    });
  });
});
