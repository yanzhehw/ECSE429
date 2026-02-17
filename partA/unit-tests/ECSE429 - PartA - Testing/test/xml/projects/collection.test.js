const { expect } = require("chai");
const {
  API_PATH,
  xmlHeaders,
  sendPost,
  sendHead,
  startServer,
  shutdownServer,
  wrapXml,
} = require("../../helpers");
const axios = require("axios");
const { BASE_URL } = require("../../helpers");

const ENDPOINT = API_PATH.projects;

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

describe("XML /projects", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 with XML content-type header", async function () {
      const res = await sendHead(ENDPOINT, xmlHeaders);
      expect(res.status).to.equal(200);
    });
  });

  describe("POST", function () {
    it("should create a project from a valid XML payload", async function () {
      const body = wrapXml("project", {
        title: "XML Created",
        active: "false",
        completed: "false",
        description: "From XML test",
      });
      const res = await xmlPost(ENDPOINT, body);

      expect(res.status).to.equal(201);
      // Response may be JSON or XML; check for title in either
      const text = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      expect(text).to.include("XML Created");
    });

    it("should reject XML with an invalid boolean for active", async function () {
      const body = wrapXml("project", {
        title: "Bad Bool",
        active: "yes",
        completed: "false",
      });
      const res = await xmlPost(ENDPOINT, body);

      expect(res.status).to.equal(400);
    });

    it("should reject malformed XML payload", async function () {
      const body = "<project><title>Broken<title></project>";
      const res = await xmlPost(ENDPOINT, body);

      expect(res.status).to.equal(400);
    });
  });
});
