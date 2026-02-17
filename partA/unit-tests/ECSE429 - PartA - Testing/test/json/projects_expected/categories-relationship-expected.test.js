const { expect } = require("chai");
const {
  API_PATH,
  RELATIONSHIP,
  sendGet,
  sendPost,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const PROJECTS = API_PATH.projects;
const CATEG_REL = RELATIONSHIP.categories;
const VALID_PROJECT_ID = 1;
const INVALID_PROJECT_ID = 99999;

function categPath(projectId) {
  return `${PROJECTS}/${projectId}/${CATEG_REL}`;
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED /projects/:id/categories – Documented behavior (should fail)", function () {
  beforeEach(async function () {
    await startServer();
    await sendPost(categPath(VALID_PROJECT_ID), { id: "1" });
  });
  afterEach(shutdownServer);

  it("GET should return 404 when project does not exist", async function () {
    // Documentation implies a nonexistent parent should yield 404.
    // Actual behavior: returns 200 and lists categories anyway.
    const res = await sendGet(categPath(INVALID_PROJECT_ID));

    expect(res.status).to.equal(404);
    expect(res.data).to.have.property("errorMessages");
  });

  it("HEAD should return 404 when project does not exist", async function () {
    const res = await sendHead(categPath(INVALID_PROJECT_ID));

    expect(res.status).to.equal(404);
  });
});
