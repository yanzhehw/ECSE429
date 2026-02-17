const { expect } = require("chai");
const {
  API_PATH,
  RELATIONSHIP,
  sendGet,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const CATEGORIES = API_PATH.categories;
const PROJ_REL = RELATIONSHIP.projects;
const INVALID_CATEG_ID = 99999;

function projPath(categId) {
  return `${CATEGORIES}/${categId}/${PROJ_REL}`;
}

// These tests assert the DOCUMENTED / EXPECTED behavior.
// They will FAIL because the API contains bugs.
describe("EXPECTED /categories/:id/projects – Documented behavior (should fail)", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  it("GET should return 404 when category does not exist", async function () {
    const res = await sendGet(projPath(INVALID_CATEG_ID));

    expect(res.status).to.equal(404);
    expect(res.data).to.have.property("errorMessages");
  });

  it("HEAD should return 404 when category does not exist", async function () {
    const res = await sendHead(projPath(INVALID_CATEG_ID));

    expect(res.status).to.equal(404);
  });
});
