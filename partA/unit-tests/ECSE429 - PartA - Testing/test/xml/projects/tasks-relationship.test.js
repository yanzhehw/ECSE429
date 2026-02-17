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

const PROJECTS = API_PATH.projects;
const TASKS_REL = RELATIONSHIP.tasks;
const VALID_PROJECT_ID = 1;
const INVALID_PROJECT_ID = 99999;

function tasksPath(pid) {
  return `${PROJECTS}/${pid}/${TASKS_REL}`;
}

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

describe("XML /projects/:id/tasks", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 for a valid project", async function () {
      const res = await sendHead(tasksPath(VALID_PROJECT_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent project (BUG)", async function () {
      const res = await sendHead(tasksPath(INVALID_PROJECT_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });
  });

  describe("POST", function () {
    // BUG: API cannot parse XML body for relationship creation
    it("[ACTUAL] should return 400 when posting XML relationship body (BUG)", async function () {
      const body = "<id>2</id>";
      const res = await xmlPost(tasksPath(VALID_PROJECT_ID), body);

      // API fails to parse the XML and returns 400 instead of creating the link
      expect(res.status).to.equal(400);
    });

    // BUG: wrong error code when project doesn't exist + XML body
    it("[ACTUAL] should return 400 for nonexistent project with XML body (BUG)", async function () {
      const body = "<id>1</id>";
      const res = await xmlPost(tasksPath(INVALID_PROJECT_ID), body);

      // Should be 404 for missing project, but 400 takes precedence due to XML parsing failure
      expect(res.status).to.equal(400);
    });
  });

  describe("DELETE", function () {
    it("should unlink a task from a project", async function () {
      const todoId = 2;
      const res = await sendDelete(
        `${PROJECTS}/${VALID_PROJECT_ID}/${TASKS_REL}/${todoId}`,
        xmlHeaders
      );
      expect(res.status).to.equal(200);

      const verifyRes = await sendGet(tasksPath(VALID_PROJECT_ID));
      const remainingIds = verifyRes.data.todos.map((t) => t.id);
      expect(remainingIds).to.not.include(String(todoId));
    });

    it("should return 404 when removing a nonexistent task link", async function () {
      const res = await sendDelete(
        `${PROJECTS}/${VALID_PROJECT_ID}/${TASKS_REL}/99999`,
        xmlHeaders
      );
      expect(res.status).to.equal(404);
    });
  });
});
