const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendPost,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const ENDPOINT = API_PATH.todos;

describe("JSON /todos", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should retrieve the default todo list on fresh start", async function () {
      const res = await sendGet(ENDPOINT);

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("todos").that.is.an("array");
      expect(res.data.todos.length).to.equal(2);
    });

    it("should contain 'scan paperwork' as a default todo", async function () {
      const res = await sendGet(ENDPOINT);
      const titles = res.data.todos.map((t) => t.title);

      expect(titles).to.include("scan paperwork");
    });

    it("should contain 'file paperwork' as a default todo", async function () {
      const res = await sendGet(ENDPOINT);
      const titles = res.data.todos.map((t) => t.title);

      expect(titles).to.include("file paperwork");
    });
  });

  // ── GET with query filters ────────────────────────────────────
  describe("GET with filters", function () {
    it("should filter todos by doneStatus=false", async function () {
      const res = await sendGet(`${ENDPOINT}?doneStatus=false`);

      expect(res.status).to.equal(200);
      res.data.todos.forEach((todo) => {
        expect(todo.doneStatus).to.equal("false");
      });
    });

    it("should filter todos by title", async function () {
      const res = await sendGet(`${ENDPOINT}?title=scan%20paperwork`);

      expect(res.status).to.equal(200);
      expect(res.data.todos).to.have.lengthOf(1);
      expect(res.data.todos[0].title).to.equal("scan paperwork");
    });

    it("should filter by multiple attributes simultaneously", async function () {
      const res = await sendGet(`${ENDPOINT}?doneStatus=false&title=file%20paperwork`);

      expect(res.status).to.equal(200);
      expect(res.data.todos).to.have.lengthOf(1);
      expect(res.data.todos[0].title).to.equal("file paperwork");
    });

    it("should return empty list when filter matches nothing", async function () {
      const res = await sendGet(`${ENDPOINT}?title=nonexistent_todo_xyz`);

      expect(res.status).to.equal(200);
      expect(res.data.todos).to.be.an("array").that.is.empty;
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 with headers and no body", async function () {
      const res = await sendHead(ENDPOINT);

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });

  // ── POST ───────────────────────────────────────────────────────
  describe("POST", function () {
    it("should create a todo with all fields", async function () {
      const payload = {
        title: "Walk the dog",
        doneStatus: false,
        description: "Take Rex to the park",
      };
      const res = await sendPost(ENDPOINT, payload);

      expect(res.status).to.equal(201);
      expect(res.data.title).to.equal("Walk the dog");
      expect(res.data.doneStatus).to.equal("false");
      expect(res.data.description).to.equal("Take Rex to the park");
      expect(res.data).to.have.property("id");
    });

    it("should create a todo with only the required title field", async function () {
      const res = await sendPost(ENDPOINT, { title: "Minimal todo" });

      expect(res.status).to.equal(201);
      expect(res.data.title).to.equal("Minimal todo");
      expect(res.data.doneStatus).to.equal("false");
      expect(res.data.description).to.equal("");
    });

    it("should verify created todo appears in the collection", async function () {
      await sendPost(ENDPOINT, { title: "Side effect check" });
      const all = await sendGet(ENDPOINT);

      const titles = all.data.todos.map((t) => t.title);
      expect(titles).to.include("Side effect check");
      expect(all.data.todos.length).to.equal(3);
    });

    it("should reject a todo missing the mandatory title", async function () {
      const res = await sendPost(ENDPOINT, {
        doneStatus: false,
        description: "No title here",
      });

      expect(res.status).to.equal(400);
      expect(res.data.errorMessages[0]).to.include("title");
    });

    it("should reject a todo with an unrecognized field", async function () {
      const res = await sendPost(ENDPOINT, {
        title: "Extra stuff",
        urgency: "high",
      });

      expect(res.status).to.equal(400);
      expect(res.data.errorMessages[0]).to.include("urgency");
    });

    it("should reject malformed JSON payload", async function () {
      const res = await sendPost(ENDPOINT, '{title: broken json}');

      expect(res.status).to.equal(400);
    });
  });
});
