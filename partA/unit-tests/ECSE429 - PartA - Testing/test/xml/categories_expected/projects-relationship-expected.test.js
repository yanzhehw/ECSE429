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

const CATEGORIES = API_PATH.categories;
const PROJ_REL = RELATIONSHIP.projects;
const VALID_CATEG_ID = 1;
const INVALID_CATEG_ID = 99999;

function projPath(categId) {
  return `${CATEGORIES}/${categId}/${PROJ_REL}`;
}

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED XML /categories/:id/projects – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("HEAD should return 404 when category does not exist", async function () {
    const res = await sendHead(projPath(INVALID_CATEG_ID), xmlHeaders);

    expect(res.status).to.equal(404);
  });

  it("POST should return 201 when creating a relationship via XML", async function () {
    const body = "<id>1</id>";
    const res = await xmlPost(projPath(VALID_CATEG_ID), body);

    expect(res.status).to.equal(201);
  });

  it("POST should return 404 for nonexistent category with XML body", async function () {
    const body = "<id>1</id>";
    const res = await xmlPost(projPath(INVALID_CATEG_ID), body);

    expect(res.status).to.equal(404);
  });
});
