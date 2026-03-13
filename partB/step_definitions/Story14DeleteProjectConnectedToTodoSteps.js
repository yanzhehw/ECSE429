const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  getTodoByTitle,
  getProjectByTitle,
  deleteProject,
  getProjectTasks
} = require('./api');

// ── When ──────────────────────────────────────────────────────────────────────

When('the student deletes the course todo list with name {string}',
  async function (projectName) {
    const project = await getProjectByTitle(projectName);
    assert.ok(project, `Project "${projectName}" not found`);
    this.lastResponse = await deleteProject(project.id);
  }
);

When('the student attempts to delete the course todo list with id {string}',
  async function (projectId) {
    this.lastResponse = await deleteProject(projectId);
  }
);

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the course todo list with name {string} no longer exists',
  async function (projectName) {
    const project = await getProjectByTitle(projectName);
    assert.strictEqual(project, null, `Project "${projectName}" still exists after deletion`);
  }
);

Then('the TODO with title {string} still exists',
  async function (todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    assert.ok(todo, `TODO "${todoTitle}" no longer exists after project deletion`);
  }
);

Then('the TODO with title {string} is still a task of the course todo list with name {string}',
  async function (todoTitle, projectName) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    const tasksRes = await getProjectTasks(project.id);
    const tasks = tasksRes.data.todos || [];
    const found = tasks.find(t => t.id === todo.id);
    assert.ok(found, `TODO "${todoTitle}" is no longer a task of project "${projectName}"`);
  }
);
