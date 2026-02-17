const { expect } = require("chai");
const axios = require("axios");
const {
  API_PATH,
  BASE_URL,
  xmlHeaders,
  sendHead,
  sendDelete,
  startServer,
  shutdownServer,
  wrapXml,
} = require("../../helpers");

const ENDPOINT = API_PATH.todos;
const EXISTING_ID = 1;
const NONEXISTENT_ID = 99999;

async function xmlPost(path, body) {
  return axios.post(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

async function xmlPut(path, body) {
  return axios.put(BASE_URL + path, body, {
    headers: xmlHeaders,
    validateStatus: () => true,
  });
}

describe("XML /todos/:id", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 for an existing todo", async function () {
      const res = await sendHead(`${ENDPOINT}/${EXISTING_ID}`, xmlHeaders);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for a nonexistent todo", async function () {
      const res = await sendHead(`${ENDPOINT}/${NONEXISTENT_ID}`, xmlHeaders);
      expect(res.status).to.equal(404);
    });
  });

  describe("POST (amend)", function () {
    it("should update fields via XML payload", async function () {
      const body = wrapXml("todo", {
        doneStatus: "true",
        description: "Done via XML",
      });
      const res = await xmlPost(`${ENDPOINT}/${EXISTING_ID}`, body);

      expect(res.status).to.equal(200);
      const text = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      expect(text).to.include("Done via XML");
    });

    it("should return 404 for a nonexistent todo", async function () {
      const body = wrapXml("todo", { description: "Nope" });
      const res = await xmlPost(`${ENDPOINT}/${NONEXISTENT_ID}`, body);

      expect(res.status).to.equal(404);
    });
  });

  describe("PUT (replace)", function () {
    it("should replace todo fields via XML payload", async function () {
      const body = wrapXml("todo", {
        title: "XML Replaced",
        doneStatus: "true",
        description: "Total replacement",
      });
      const res = await xmlPut(`${ENDPOINT}/${EXISTING_ID}`, body);

      expect(res.status).to.equal(200);
      const text = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      expect(text).to.include("XML Replaced");
    });

    it("should return 404 for a nonexistent todo", async function () {
      const body = wrapXml("todo", { title: "Phantom" });
      const res = await xmlPut(`${ENDPOINT}/${NONEXISTENT_ID}`, body);

      expect(res.status).to.equal(404);
    });
  });

  describe("DELETE", function () {
    it("should delete a todo via XML content type", async function () {
      const res = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`, xmlHeaders);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for a nonexistent todo", async function () {
      const res = await sendDelete(`${ENDPOINT}/${NONEXISTENT_ID}`, xmlHeaders);
      expect(res.status).to.equal(404);
    });

    it("should return 404 when deleting the same todo twice", async function () {
      await sendDelete(`${ENDPOINT}/${EXISTING_ID}`, xmlHeaders);
      const secondAttempt = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`, xmlHeaders);
      expect(secondAttempt.status).to.equal(404);
    });
  });
});
