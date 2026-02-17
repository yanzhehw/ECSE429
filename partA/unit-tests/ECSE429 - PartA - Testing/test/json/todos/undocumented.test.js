const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

describe("JSON Undocumented /todos endpoints", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET /todos/tasksof ────────────────────────────────────────
  describe("GET /todos/tasksof (undocumented)", function () {
    it("should return all todo-project relationships", async function () {
      const res = await sendGet("/todos/tasksof");

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("projects").that.is.an("array");
    });

    it("should contain the default Office Work project relationship", async function () {
      const res = await sendGet("/todos/tasksof");

      const titles = res.data.projects.map((p) => p.title);
      expect(titles).to.include("Office Work");
    });
  });

  // ── HEAD /todos/tasksof ───────────────────────────────────────
  describe("HEAD /todos/tasksof (undocumented)", function () {
    it("should return 200 with headers", async function () {
      const res = await sendHead("/todos/tasksof");

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });

  // ── GET /todos/categories ─────────────────────────────────────
  describe("GET /todos/categories (undocumented)", function () {
    it("should return all todo-category relationships", async function () {
      const res = await sendGet("/todos/categories");

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("categories").that.is.an("array");
    });

    it("should contain default category Office", async function () {
      const res = await sendGet("/todos/categories");

      const titles = res.data.categories.map((c) => c.title);
      expect(titles).to.include("Office");
    });
  });

  // ── HEAD /todos/categories ────────────────────────────────────
  describe("HEAD /todos/categories (undocumented)", function () {
    it("should return 200 with headers", async function () {
      const res = await sendHead("/todos/categories");

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });
});
