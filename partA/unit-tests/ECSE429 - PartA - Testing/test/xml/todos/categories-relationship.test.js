const { expect } = require("chai");
const axios = require("axios");
const {
  API_PATH,
  BASE_URL,
  RELATIONSHIP,
  xmlHeaders,
  sendHead,
  sendDelete,
  sendGet,
  startServer,
  shutdownServer,
} = require("../../helpers");

const TODOS = API_PATH.todos;
const CATEG_REL = RELATIONSHIP.categories;
const VALID_TODO_ID = 1;
const INVALID_TODO_ID = 99999;

function categPath(todoId) {
  return `${TODOS}/${todoId}/${CATEG_REL}`;
}

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

describe("XML /todos/:id/categories", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 for a valid todo", async function () {
      const res = await sendHead(categPath(VALID_TODO_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });

    // BUG
    it("[ACTUAL] should return 200 for a nonexistent todo (BUG)", async function () {
      const res = await sendHead(categPath(INVALID_TODO_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });
  });

  describe("POST", function () {
    // BUG: API cannot parse XML body for relationship creation
    it("[ACTUAL] should return 400 when posting XML relationship body (BUG)", async function () {
      const body = "<id>2</id>";
      const res = await xmlPost(categPath(VALID_TODO_ID), body);

      expect(res.status).to.equal(400);
    });

    // BUG: wrong error code
    it("[ACTUAL] should return 400 for nonexistent todo with XML body (BUG)", async function () {
      const body = "<id>1</id>";
      const res = await xmlPost(categPath(INVALID_TODO_ID), body);

      expect(res.status).to.equal(400);
    });
  });

  describe("DELETE", function () {
    it("should unlink a category from a todo", async function () {
      const delRes = await sendDelete(`${TODOS}/${VALID_TODO_ID}/${CATEG_REL}/1`, xmlHeaders);
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(categPath(VALID_TODO_ID));
      expect(afterRes.data.categories).to.be.an("array").that.is.empty;
    });

    it("should return 404 when removing a nonexistent category link", async function () {
      const res = await sendDelete(`${TODOS}/${VALID_TODO_ID}/${CATEG_REL}/99999`, xmlHeaders);
      expect(res.status).to.equal(404);
    });
  });
});
