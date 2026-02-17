const { expect } = require("chai");
const axios = require("axios");
const {
  API_PATH,
  BASE_URL,
  RELATIONSHIP,
  xmlHeaders,
  sendHead,
  sendPost,
  startServer,
  shutdownServer,
} = require("../../helpers");

const PROJECTS = API_PATH.projects;
const CATEG_REL = RELATIONSHIP.categories;
const VALID_PROJECT_ID = 1;
const INVALID_PROJECT_ID = 99999;

function categPath(pid) {
  return `${PROJECTS}/${pid}/${CATEG_REL}`;
}

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED XML /projects/:id/categories – Documented behavior (should fail)", function () {
  beforeEach(async function () {
    await startServer();
    await sendPost(categPath(VALID_PROJECT_ID), { id: "1" });
  });
  afterEach(shutdownServer);

  it("HEAD should return 404 when project does not exist", async function () {
    const res = await sendHead(categPath(INVALID_PROJECT_ID), xmlHeaders);

    expect(res.status).to.equal(404);
  });

  it("POST should return 201 when creating a relationship via XML", async function () {
    const body = "<id>2</id>";
    const res = await xmlPost(categPath(VALID_PROJECT_ID), body);

    expect(res.status).to.equal(201);
  });

  it("POST should return 404 for nonexistent project with XML body", async function () {
    const body = "<id>1</id>";
    const res = await xmlPost(categPath(INVALID_PROJECT_ID), body);

    expect(res.status).to.equal(404);
  });
});
