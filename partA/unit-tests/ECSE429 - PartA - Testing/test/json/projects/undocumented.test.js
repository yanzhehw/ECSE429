const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

describe("JSON Undocumented /projects endpoints", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET /projects/tasks ───────────────────────────────────────
  describe("GET /projects/tasks (undocumented)", function () {
    it("should return all project-todo relationships", async function () {
      const res = await sendGet("/projects/tasks");

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("todos").that.is.an("array");
    });

    it("should contain the default todos", async function () {
      const res = await sendGet("/projects/tasks");

      const titles = res.data.todos.map((t) => t.title);
      expect(titles).to.include("scan paperwork");
      expect(titles).to.include("file paperwork");
    });
  });

  // ── HEAD /projects/tasks ──────────────────────────────────────
  describe("HEAD /projects/tasks (undocumented)", function () {
    it("should return 200 with headers", async function () {
      const res = await sendHead("/projects/tasks");

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });

  // ── GET /projects/categories ──────────────────────────────────
  describe("GET /projects/categories (undocumented)", function () {
    it("should return all project-category relationships", async function () {
      const res = await sendGet("/projects/categories");

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("categories").that.is.an("array");
    });
  });

  // ── HEAD /projects/categories ─────────────────────────────────
  describe("HEAD /projects/categories (undocumented)", function () {
    it("should return 200 with headers", async function () {
      const res = await sendHead("/projects/categories");

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });
});
