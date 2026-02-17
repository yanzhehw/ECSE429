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

describe("XML /projects/:id/categories", function () {
  beforeEach(async function () {
    await startServer();
    await sendPost(categPath(VALID_PROJECT_ID), { id: "1" });
  });
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 for a valid project", async function () {
      const res = await sendHead(categPath(VALID_PROJECT_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent project (BUG)", async function () {
      const res = await sendHead(categPath(INVALID_PROJECT_ID), xmlHeaders);
      expect(res.status).to.equal(200);
    });
  });

  describe("POST", function () {
    // BUG: API cannot parse XML body for relationship creation
    it("[ACTUAL] should return 400 when posting XML relationship body (BUG)", async function () {
      const body = "<id>2</id>";
      const res = await xmlPost(categPath(VALID_PROJECT_ID), body);

      expect(res.status).to.equal(400);
    });

    // BUG: wrong error code when project doesn't exist + XML body
    it("[ACTUAL] should return 400 for nonexistent project with XML body (BUG)", async function () {
      const body = "<id>1</id>";
      const res = await xmlPost(categPath(INVALID_PROJECT_ID), body);

      expect(res.status).to.equal(400);
    });
  });

  describe("DELETE", function () {
    it("should unlink a category from a project", async function () {
      const delRes = await sendDelete(
        `${PROJECTS}/${VALID_PROJECT_ID}/${CATEG_REL}/1`,
        xmlHeaders
      );
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(categPath(VALID_PROJECT_ID));
      expect(afterRes.data.categories).to.be.an("array").that.is.empty;
    });

    it("should return 404 when removing a nonexistent category link", async function () {
      const res = await sendDelete(
        `${PROJECTS}/${VALID_PROJECT_ID}/${CATEG_REL}/99999`,
        xmlHeaders
      );
      expect(res.status).to.equal(404);
    });
  });
});
