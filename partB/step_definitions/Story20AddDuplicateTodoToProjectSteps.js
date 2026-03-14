const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  getTodoByTitle,
  getProjectByTitle,
  addTaskToProject,
  addProjectToTodo,
  getProjectTasks,
  getTodoProjects
} = require('./api');

// ── Given ─────────────────────────────────────────────────────────────────────

Given('the TODO with title {string} is already a task of the course todo list with name {string}',
  async function (todoTitle, projectName) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    const res = await addTaskToProject(project.id, todo.id);
    assert.strictEqual(res.status, 201, `Failed to set up initial relationship for "${todoTitle}" -> "${projectName}"`);
  }
);

// ── When ──────────────────────────────────────────────────────────────────────

When('a student adds a TODO with title {string} to a course todo list with name {string} via the project tasks endpoint',
  async function (todoTitle, projectName) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    this.lastResponse = await addTaskToProject(project.id, todo.id);
  }
);

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the project with name {string} still contains exactly one task with title {string}',
  async function (projectName, todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    const tasksRes = await getProjectTasks(project.id);
    const tasks = tasksRes.data.todos || [];
    const matches = tasks.filter(t => t.id === todo.id);
    assert.strictEqual(
      matches.length, 1,
      `Expected exactly 1 task with title "${todoTitle}" in project "${projectName}", found ${matches.length}`
    );
  }
);

Then('the project with name {string} contains exactly one task with title {string}',
  async function (projectName, todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    const tasksRes = await getProjectTasks(project.id);
    const tasks = tasksRes.data.todos || [];
    const matches = tasks.filter(t => t.id === todo.id);
    assert.strictEqual(
      matches.length, 1,
      `Expected exactly 1 task with title "${todoTitle}" in project "${projectName}", found ${matches.length}`
    );
  }
);

Then('the project with name {string} is not visible from the TODO with title {string}',
  async function (projectName, todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    const res = await getTodoProjects(todo.id);
    const projects = res.data.projects || [];
    const found = projects.find(p => p.id === project.id);
    assert.ok(!found, `Project "${projectName}" is unexpectedly visible from TODO "${todoTitle}" via tasksof`);
  }
);

Then('the student is notified that the relationship already exists with a message {string}',
  function (message) {
    assert.ok(
      this.lastResponse.status >= 400,
      `Expected an error response but got status ${this.lastResponse.status}`
    );
    const errors = this.lastResponse.data.errorMessages || [];
    assert.ok(
      errors.some(e => e.includes(message.replace(/"/g, ''))),
      `Expected error message "${message}" but got: ${JSON.stringify(errors)}`
    );
  }
);
