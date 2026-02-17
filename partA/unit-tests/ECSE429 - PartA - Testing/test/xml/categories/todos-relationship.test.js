const { expect } = require("chai");
const axios = require("axios");
const {
  API_PATH,
  BASE_URL,
  xmlHeaders,
  sendHead,
  sendDelete,
  sendGet,
  sendPost,
  startServer,
  shutdownServer,
} = require("../../helpers");

const CATEGORIES = API_PATH.categories;
const TODOS_REL = "todos";
const VALID_CATEG_ID = 1;
const INVALID_CATEG_ID = 99999;

function todosPath(categId) {
  return `${CATEGORIES}/${categId}/${TODOS_REL}`;
}

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

describe("XML /categories/:id/todos", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 for a valid category", async function () {
      const res = await sendHead(todosPath(VALID_CATEG_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });

    // BUG
    it("[ACTUAL] should return 200 for a nonexistent category (BUG)", async function () {
      const res = await sendHead(todosPath(INVALID_CATEG_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });
  });

  describe("POST", function () {
    // BUG: API cannot parse XML body for relationship creation
    it("[ACTUAL] should return 400 when posting XML relationship body (BUG)", async function () {
      const body = "<id>2</id>";
      const res = await xmlPost(todosPath(VALID_CATEG_ID), body);

      expect(res.status).to.equal(400);
    });

    // BUG: wrong error code
    it("[ACTUAL] should return 400 for nonexistent category with XML body (BUG)", async function () {
      const body = "<id>1</id>";
      const res = await xmlPost(todosPath(INVALID_CATEG_ID), body);

      expect(res.status).to.equal(400);
    });
  });

  describe("DELETE", function () {
    it("should unlink a todo from a category", async function () {
      // Link via JSON first (XML POST is bugged)
      await sendPost(`${CATEGORIES}/${VALID_CATEG_ID}/${TODOS_REL}`, { id: "1" });

      const delRes = await sendDelete(
        `${CATEGORIES}/${VALID_CATEG_ID}/${TODOS_REL}/1`,
        xmlHeaders
      );
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(todosPath(VALID_CATEG_ID));
      const remainingIds = afterRes.data.todos.map((t) => t.id);
      expect(remainingIds).to.not.include("1");
    });

    it("should return 404 when removing a nonexistent todo link", async function () {
      const res = await sendDelete(
        `${CATEGORIES}/${VALID_CATEG_ID}/${TODOS_REL}/99999`,
        xmlHeaders
      );
      expect(res.status).to.equal(404);
    });
  });
});
