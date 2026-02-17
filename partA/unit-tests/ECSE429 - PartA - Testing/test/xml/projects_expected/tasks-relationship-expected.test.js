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

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED XML /projects/:id/tasks – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("HEAD should return 404 when project does not exist", async function () {
    const res = await sendHead(tasksPath(INVALID_PROJECT_ID), xmlHeaders);

    expect(res.status).to.equal(404);
  });

  it("POST should return 201 when creating a relationship via XML", async function () {
    // The API should accept XML payloads for relationship creation just like JSON.
    const body = "<id>2</id>";
    const res = await xmlPost(tasksPath(VALID_PROJECT_ID), body);

    expect(res.status).to.equal(201);
  });

  it("POST should return 404 for nonexistent project with XML body", async function () {
    // Should report the missing project, not an XML parse error.
    const body = "<id>1</id>";
    const res = await xmlPost(tasksPath(INVALID_PROJECT_ID), body);

    expect(res.status).to.equal(404);
  });
});
