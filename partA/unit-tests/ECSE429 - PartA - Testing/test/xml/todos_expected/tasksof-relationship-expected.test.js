const { expect } = require("chai");
const axios = require("axios");
const {
  API_PATH,
  BASE_URL,
  RELATIONSHIP,
  xmlHeaders,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const TODOS = API_PATH.todos;
const TASKSOF_REL = RELATIONSHIP.tasksof;
const VALID_TODO_ID = 2;
const INVALID_TODO_ID = 99999;

function tasksofPath(todoId) {
  return `${TODOS}/${todoId}/${TASKSOF_REL}`;
}

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED XML /todos/:id/tasksof – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("HEAD should return 404 when todo does not exist", async function () {
    const res = await sendHead(tasksofPath(INVALID_TODO_ID), xmlHeaders);

    expect(res.status).to.equal(404);
  });

  it("POST should return 201 when creating a relationship via XML", async function () {
    const body = "<id>1</id>";
    const res = await xmlPost(tasksofPath(VALID_TODO_ID), body);

    expect(res.status).to.equal(201);
  });

  it("POST should return 404 for nonexistent todo with XML body", async function () {
    const body = "<id>1</id>";
    const res = await xmlPost(tasksofPath(INVALID_TODO_ID), body);

    expect(res.status).to.equal(404);
  });
});
