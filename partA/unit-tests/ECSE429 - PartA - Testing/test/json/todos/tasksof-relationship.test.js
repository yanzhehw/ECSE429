const { expect } = require("chai");
const {
  API_PATH,
  RELATIONSHIP,
  sendGet,
  sendPost,
  sendDelete,
  sendHead,
  startServer,
  shutdownServer,
} = require("../../helpers");

const TODOS = API_PATH.todos;
const PROJECTS = API_PATH.projects;
const TASKSOF_REL = RELATIONSHIP.tasksof;
const TASKS_REL = RELATIONSHIP.tasks;
const VALID_TODO_ID = 2;
const INVALID_TODO_ID = 99999;

function tasksofPath(todoId) {
  return `${TODOS}/${todoId}/${TASKSOF_REL}`;
}

function tasksofDeletePath(todoId, projId) {
  return `${TODOS}/${todoId}/${TASKSOF_REL}/${projId}`;
}

describe("JSON /todos/:id/tasksof", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return projects that todo 2 belongs to", async function () {
      const res = await sendGet(tasksofPath(VALID_TODO_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("projects").that.is.an("array");
      expect(res.data.projects.length).to.be.at.least(1);
      expect(res.data.projects[0].title).to.equal("Office Work");
    });

    // BUG: returns 200 with duplicated data instead of 404
    it("[ACTUAL] should return 200 for a nonexistent todo id (BUG)", async function () {
      const res = await sendGet(tasksofPath(INVALID_TODO_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("projects").that.is.an("array");
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for a valid todo", async function () {
      const res = await sendHead(tasksofPath(VALID_TODO_ID));
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent todo (BUG)", async function () {
      const res = await sendHead(tasksofPath(INVALID_TODO_ID));
      expect(res.status).to.equal(200);
    });
  });

  // ── POST (create relationship) ────────────────────────────────
  describe("POST", function () {
    it("should link a todo to a new project and verify bidirectionality", async function () {
      const projRes = await sendPost(PROJECTS, {
        title: "Weekend Chores",
        active: true,
      });
      const newProjId = projRes.data.id;

      const linkRes = await sendPost(tasksofPath(1), { id: newProjId });
      expect(linkRes.status).to.equal(201);

      // Verify from todo side
      const todoSide = await sendGet(tasksofPath(1));
      const projIds = todoSide.data.projects.map((p) => p.id);
      expect(projIds).to.include(newProjId);

      // Verify from project side (bidirectional)
      const projSide = await sendGet(`${PROJECTS}/${newProjId}/${TASKS_REL}`);
      const todoIds = projSide.data.todos.map((t) => t.id);
      expect(todoIds).to.include("1");
    });

    it("should return 404 when linking a nonexistent todo to a project", async function () {
      const res = await sendPost(tasksofPath(INVALID_TODO_ID), { id: "1" });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE (remove relationship) ──────────────────────────────
  describe("DELETE", function () {
    it("should unlink a todo from its project and verify both sides", async function () {
      const delRes = await sendDelete(tasksofDeletePath(VALID_TODO_ID, 1));
      expect(delRes.status).to.equal(200);

      // Todo should no longer reference the project
      const todoSide = await sendGet(tasksofPath(VALID_TODO_ID));
      expect(todoSide.data.projects).to.be.an("array").that.is.empty;

      // Project should no longer reference the todo
      const projSide = await sendGet(`${PROJECTS}/1/${TASKS_REL}`);
      const remainingIds = projSide.data.todos.map((t) => t.id);
      expect(remainingIds).to.not.include(String(VALID_TODO_ID));
    });

    it("should return 404 when removing an already-deleted relationship", async function () {
      await sendDelete(tasksofDeletePath(VALID_TODO_ID, 1));
      const secondAttempt = await sendDelete(tasksofDeletePath(VALID_TODO_ID, 1));

      expect(secondAttempt.status).to.equal(404);
      expect(secondAttempt.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });
});
