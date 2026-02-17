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

const PROJECTS = API_PATH.projects;
const TODOS = API_PATH.todos;
const TASKS_REL = RELATIONSHIP.tasks;
const TASKSOF_REL = RELATIONSHIP.tasksof;
const VALID_PROJECT_ID = 1;
const INVALID_PROJECT_ID = 99999;

function tasksPath(projectId) {
  return `${PROJECTS}/${projectId}/${TASKS_REL}`;
}

function taskDeletePath(projectId, todoId) {
  return `${PROJECTS}/${projectId}/${TASKS_REL}/${todoId}`;
}

describe("JSON /projects/:id/tasks", function () {
  beforeEach(startServer);
  afterEach(shutdownServer);

  // ── GET ────────────────────────────────────────────────────────
  describe("GET", function () {
    it("should return the default tasks for project 1", async function () {
      const res = await sendGet(tasksPath(VALID_PROJECT_ID));

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("todos").that.is.an("array");
      expect(res.data.todos.length).to.be.at.least(1);
    });

    it("should return tasks with correct structure and fields", async function () {
      const res = await sendGet(tasksPath(VALID_PROJECT_ID));
      const firstTodo = res.data.todos[0];

      expect(firstTodo).to.have.property("id");
      expect(firstTodo).to.have.property("title");
      expect(firstTodo).to.have.property("doneStatus");
    });

    // BUG: returns 200 with data instead of 404
    it("[ACTUAL] should return 200 for a nonexistent project id (BUG)", async function () {
      const res = await sendGet(tasksPath(INVALID_PROJECT_ID));

      // The API incorrectly returns 200 and shows todos regardless of project existence
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property("todos").that.is.an("array");
    });
  });

  // ── HEAD ───────────────────────────────────────────────────────
  describe("HEAD", function () {
    it("should return 200 for a valid project", async function () {
      const res = await sendHead(tasksPath(VALID_PROJECT_ID));
      expect(res.status).to.equal(200);
    });

    // BUG: returns 200 instead of 404
    it("[ACTUAL] should return 200 for a nonexistent project (BUG)", async function () {
      const res = await sendHead(tasksPath(INVALID_PROJECT_ID));
      expect(res.status).to.equal(200);
    });
  });

  // ── POST (create relationship) ────────────────────────────────
  describe("POST", function () {
    it("should link an existing todo to a project", async function () {
      const createRes = await sendPost(TODOS, {
        title: "Buy supplies",
        doneStatus: false,
      });
      const newTodoId = createRes.data.id;

      const linkRes = await sendPost(tasksPath(VALID_PROJECT_ID), { id: newTodoId });
      expect(linkRes.status).to.equal(201);

      const verifyRes = await sendGet(tasksPath(VALID_PROJECT_ID));
      const linkedIds = verifyRes.data.todos.map((t) => t.id);
      expect(linkedIds).to.include(newTodoId);
    });

    it("should confirm bidirectional link (todo sees project via tasksof)", async function () {
      const createRes = await sendPost(TODOS, { title: "Verify bidirection" });
      const newTodoId = createRes.data.id;

      await sendPost(tasksPath(VALID_PROJECT_ID), { id: newTodoId });

      const todoSide = await sendGet(`${TODOS}/${newTodoId}/${TASKSOF_REL}`);
      expect(todoSide.status).to.equal(200);

      const projectIds = todoSide.data.projects.map((p) => p.id);
      expect(projectIds).to.include("1");
    });

    it("should return 404 when linking to a nonexistent project", async function () {
      const res = await sendPost(tasksPath(INVALID_PROJECT_ID), { id: "1" });

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });

  // ── DELETE (remove relationship) ──────────────────────────────
  describe("DELETE", function () {
    it("should unlink a task from a project", async function () {
      const beforeRes = await sendGet(tasksPath(VALID_PROJECT_ID));
      const taskToRemove = beforeRes.data.todos[0].id;

      const delRes = await sendDelete(taskDeletePath(VALID_PROJECT_ID, taskToRemove));
      expect(delRes.status).to.equal(200);

      const afterRes = await sendGet(tasksPath(VALID_PROJECT_ID));
      const remainingIds = afterRes.data.todos.map((t) => t.id);
      expect(remainingIds).to.not.include(taskToRemove);
    });

    it("should confirm bidirectional deletion (todo no longer sees project)", async function () {
      const todoId = 2;
      await sendDelete(taskDeletePath(VALID_PROJECT_ID, todoId));

      const todoSide = await sendGet(`${TODOS}/${todoId}/${TASKSOF_REL}`);
      expect(todoSide.status).to.equal(200);
      expect(todoSide.data.projects).to.be.an("array").that.is.empty;
    });

    it("should return 404 when unlinking a nonexistent relationship", async function () {
      const res = await sendDelete(taskDeletePath(VALID_PROJECT_ID, 99999));

      expect(res.status).to.equal(404);
      expect(res.data.errorMessages).to.be.an("array").that.is.not.empty;
    });
  });
});
