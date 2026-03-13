const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  getTodoByTitle,
  getProjectByTitle,
  addTaskToProject,
  getTodoProjects,
  getProjectTasks
} = require('./api');

// ── Given ─────────────────────────────────────────────────────────────────────

Given('the TODO with title {string} is also added to the course todo list with name {string}',
  async function (todoTitle, projectName) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    await addTaskToProject(project.id, todo.id);
  }
);

// ── When ──────────────────────────────────────────────────────────────────────

When('a student retrieves all projects for the TODO with title {string}',
  async function (todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    this.lastResponse = await getTodoProjects(todo.id);
  }
);

When('a student retrieves all projects for the TODO with id {string}',
  async function (todoId) {
    this.lastResponse = await getTodoProjects(todoId);
  }
);

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the response contains the project with name {string}',
  async function (projectName) {
    const projects = this.lastResponse.data.projects || [];
    const found = projects.find(p => p.title === projectName);
    assert.ok(found, `Project "${projectName}" not found in response`);
  }
);

Then('the project with name {string} can see the TODO with title {string}',
  async function (projectName, todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    const tasksRes = await getProjectTasks(project.id);
    const tasks = tasksRes.data.todos || [];
    const found = tasks.find(t => t.id === todo.id);
    assert.ok(found, `TODO "${todoTitle}" is not visible from project "${projectName}"`);
  }
);
