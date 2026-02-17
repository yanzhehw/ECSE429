const { expect } = require("chai");
const axios = require("axios");
const {
  API_PATH,
  BASE_URL,
  xmlHeaders,
  sendHead,
  startServer,
  shutdownServer,
  wrapXml,
} = require("../../helpers");

const ENDPOINT = API_PATH.todos;

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

describe("XML /todos", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 with XML content negotiation", async function () {
      const res = await sendHead(ENDPOINT, xmlHeaders);
      expect(res.status).to.equal(200);
    });
  });

  describe("POST", function () {
    it("should create a todo from a valid XML payload", async function () {
      const body = wrapXml("todo", {
        title: "XML Todo",
        doneStatus: "false",
        description: "Created via XML",
      });
      const res = await xmlPost(ENDPOINT, body);

      expect(res.status).to.equal(201);
      const text = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      expect(text).to.include("XML Todo");
    });

    it("should reject XML payload missing the mandatory title", async function () {
      const body = wrapXml("todo", {
        doneStatus: "false",
        description: "No title",
      });
      const res = await xmlPost(ENDPOINT, body);

      expect(res.status).to.equal(400);
    });

    it("should reject malformed XML payload", async function () {
      const body = "<todo><title>Broken<title></todo>";
      const res = await xmlPost(ENDPOINT, body);

      expect(res.status).to.equal(400);
    });

    it("should reject XML with an unrecognized field", async function () {
      const body = wrapXml("todo", {
        title: "Bad field",
        priority: "high",
      });
      const res = await xmlPost(ENDPOINT, body);

      expect(res.status).to.equal(400);
    });
  });
});
