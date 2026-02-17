const { expect } = require("chai");
const {
  API_PATH,
  RELATIONSHIP,
  sendGet,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const PROJECTS = API_PATH.projects;
const TASKS_REL = RELATIONSHIP.tasks;
const INVALID_PROJECT_ID = 99999;

function tasksPath(projectId) {
  return `${PROJECTS}/${projectId}/${TASKS_REL}`;
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED /projects/:id/tasks – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("GET should return 404 when project does not exist", async function () {
    // Documentation implies a nonexistent parent should yield 404.
    // Actual behavior: returns 200 and dumps unrelated todos.
    const res = await sendGet(tasksPath(INVALID_PROJECT_ID));

    expect(res.status).to.equal(404);
    expect(res.data).to.have.property("errorMessages");
  });

  it("HEAD should return 404 when project does not exist", async function () {
    // Same root cause: the API ignores invalid parent IDs for relationship endpoints.
    const res = await sendHead(tasksPath(INVALID_PROJECT_ID));

    expect(res.status).to.equal(404);
  });
});
