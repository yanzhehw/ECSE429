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

const ENDPOINT = API_PATH.categories;
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

describe("XML /categories/:id", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  describe("HEAD", function () {
    it("should return 200 for an existing category", async function () {
      const res = await sendHead(`${ENDPOINT}/${EXISTING_ID}`, xmlHeaders);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for a nonexistent category", async function () {
      const res = await sendHead(`${ENDPOINT}/${NONEXISTENT_ID}`, xmlHeaders);
      expect(res.status).to.equal(404);
    });
  });

  describe("POST (amend)", function () {
    it("should update fields via XML payload", async function () {
      const body = wrapXml("category", { description: "Updated by XML" });
      const res = await xmlPost(`${ENDPOINT}/${EXISTING_ID}`, body);

      expect(res.status).to.equal(200);
      const text = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      expect(text).to.include("Updated by XML");
    });

    it("should return 404 for a nonexistent category", async function () {
      const body = wrapXml("category", { title: "Nope" });
      const res = await xmlPost(`${ENDPOINT}/${NONEXISTENT_ID}`, body);

      expect(res.status).to.equal(404);
    });
  });

  describe("PUT (replace)", function () {
    it("should replace category fields via XML payload", async function () {
      const body = wrapXml("category", {
        title: "XML Replaced",
        description: "Fully replaced",
      });
      const res = await xmlPut(`${ENDPOINT}/${EXISTING_ID}`, body);

      expect(res.status).to.equal(200);
      const text = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      expect(text).to.include("XML Replaced");
    });

    it("should return 404 for a nonexistent category", async function () {
      const body = wrapXml("category", { title: "Ghost" });
      const res = await xmlPut(`${ENDPOINT}/${NONEXISTENT_ID}`, body);

      expect(res.status).to.equal(404);
    });
  });

  describe("DELETE", function () {
    it("should delete a category via XML content type", async function () {
      const res = await sendDelete(`${ENDPOINT}/${EXISTING_ID}`, xmlHeaders);
      expect(res.status).to.equal(200);
    });

    it("should return 404 for a nonexistent category", async function () {
      const res = await sendDelete(`${ENDPOINT}/${NONEXISTENT_ID}`, xmlHeaders);
      expect(res.status).to.equal(404);
    });
  });
});
