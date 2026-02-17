const { expect } = require("chai");
const {
  API_PATH,
  sendGet,
  sendPost,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const ENDPOINT = API_PATH.categories;

describe("JSON /categories", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should retrieve the default categories on fresh start", async function () {
      const res = await sendGet(ENDPOINT);

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("categories").that.is.an("array");
      expect(res.data.categories.length).to.equal(2);
    });

    it("should contain 'Office' and 'Home' as defaults", async function () {
      const res = await sendGet(ENDPOINT);
      const titles = res.data.categories.map((c) => c.title);

      expect(titles).to.include("Office");
      expect(titles).to.include("Home");
    });
  });

  // ── GET with query filters ────────────────────────────────────
  describe("GET with filters", function () {
    it("should filter categories by title", async function () {
      const res = await sendGet(`${ENDPOINT}?title=Office`);

      expect(res.status).to.equal(200);
      expect(res.data.categories).to.have.lengthOf(1);
      expect(res.data.categories[0].title).to.equal("Office");
    });

    it("should return empty list when filter matches nothing", async function () {
      const res = await sendGet(`${ENDPOINT}?title=nonexistent_category_xyz`);

      expect(res.status).to.equal(200);
      expect(res.data.categories).to.be.an("array").that.is.empty;
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 with headers", async function () {
      const res = await sendHead(ENDPOINT);

      expect(res.status).to.equal(200);
      expect(res.headers).to.have.property("content-type");
    });
  });

  // ── POST ───────────────────────────────────────────────────────
  describe("POST", function () {
    it("should create a new category with title and description", async function () {
      const payload = {
        title: "Errands",
        description: "Things to do outside",
      };
      const res = await sendPost(ENDPOINT, payload);

      expect(res.status).to.equal(201);
      expect(res.data.title).to.equal("Errands");
      expect(res.data.description).to.equal("Things to do outside");
      expect(res.data).to.have.property("id");
    });

    it("should create a category with only the title", async function () {
      const res = await sendPost(ENDPOINT, { title: "Quick" });

      expect(res.status).to.equal(201);
      expect(res.data.title).to.equal("Quick");
      expect(res.data.description).to.equal("");
    });

    it("should verify new category shows up in the collection", async function () {
      await sendPost(ENDPOINT, { title: "Side Effect Test" });
      const all = await sendGet(ENDPOINT);

      const titles = all.data.categories.map((c) => c.title);
      expect(titles).to.include("Side Effect Test");
      expect(all.data.categories.length).to.equal(3);
    });

    it("should reject a category without a title", async function () {
      const res = await sendPost(ENDPOINT, { description: "Missing title" });

      expect(res.status).to.equal(400);
      expect(res.data.errorMessages[0]).to.include("title");
    });

    it("should reject malformed JSON payload", async function () {
      const res = await sendPost(ENDPOINT, '{"title: oops}');

      expect(res.status).to.equal(400);
    });
  });
});
