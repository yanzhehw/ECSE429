const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendHead,
  sendPost,
  startServer,
  shutdownServer,
} = require("../../helpers");

describe("JSON Undocumented /categories endpoints", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET /categories/todos ─────────────────────────────────────
  describe("GET /categories/todos (undocumented)", function () {
    it("should return all category-todo relationships", async function () {
      const res = await sendGet("/categories/todos");

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("todos").that.is.an("array");
    });

    it("should reflect newly created relationships", async function () {
      await sendPost("/categories/1/todos", { id: "1" });
      const res = await sendGet("/categories/todos");

      const todoIds = res.data.todos.map((t) => t.id);
      expect(todoIds).to.include("1");
    });
  });

  // ── HEAD /categories/todos ────────────────────────────────────
  describe("HEAD /categories/todos (undocumented)", function () {
    it("should return 200 with headers", async function () {
      const res = await sendHead("/categories/todos");

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });

  // ── GET /categories/projects ──────────────────────────────────
  describe("GET /categories/projects (undocumented)", function () {
    it("should return all category-project relationships", async function () {
      const res = await sendGet("/categories/projects");

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("projects").that.is.an("array");
    });

    it("should reflect newly created relationships", async function () {
      await sendPost("/categories/1/projects", { id: "1" });
      const res = await sendGet("/categories/projects");

      const projIds = res.data.projects.map((p) => p.id);
      expect(projIds).to.include("1");
    });
  });

  // ── HEAD /categories/projects ─────────────────────────────────
  describe("HEAD /categories/projects (undocumented)", function () {
    it("should return 200 with headers", async function () {
      const res = await sendHead("/categories/projects");

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });
});
