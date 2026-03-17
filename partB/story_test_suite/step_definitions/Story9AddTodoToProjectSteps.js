const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  getTodoByTitle,
  getProjectByTitle,
  createTodo,
  addTaskToProject,
  getProjectTasks
} = require('./api');

// ── Given ─────────────────────────────────────────────────────────────────────

Given('the student creates a TODO with title {string} and description {string}',
  async function (title, description) {
    const res = await createTodo({ title, description, doneStatus: false });
    assert.strictEqual(res.status, 201);
  }
);

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('a student adds a TODO with title {string} to a course todo list with name {string}',
  async function (todoTitle, projectName) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    this.lastResponse = await addTaskToProject(project.id, todo.id);
  }
);

Then('the TODO with title {string} is added as a task of the course todo list with name {string}',
  async function (todoTitle, projectName) {
    assert.strictEqual(this.lastResponse.status, 201);
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    const tasksRes = await getProjectTasks(project.id);
    const tasks = tasksRes.data.todos || [];
    const found = tasks.find(t => t.id === todo.id);
    assert.ok(found, `TODO "${todoTitle}" was not found in project "${projectName}" tasks`);
  }
);

// ── Error Flow ────────────────────────────────────────────────────────────────

When('a student adds a TODO with title {string} to a course todo list with id {string}',
  async function (todoTitle, projectId) {
    const todo = await getTodoByTitle(todoTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    this.lastResponse = await addTaskToProject(projectId, todo.id);
  }
);
