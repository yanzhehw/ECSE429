const { Given, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const {
  createProject,
  createTodo,
  getTodoByTitle,
  getProjectByTitle,
  addTaskToProject
} = require('./api');

const BASE_URL = 'http://localhost:4567';

// ── Server state ──────────────────────────────────────────────────────────────

Given('the server is running', async function () {
  try {
    await axios.get(`${BASE_URL}/projects`, { validateStatus: () => true });
  } catch (error) {
    throw new Error('Server is not running. Please start the Todo Manager.');
  }
});

Given('the server is not running', function () {
  // Intentionally empty — the When step will attempt the call and catch the failure
});

// ── Background data setup ────────────────────────────────────────────────────

Given('course todo list projects with the following details exist', async function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    await createProject({
      title: row.title,
      completed: row.completed === 'true',
      description: row.description,
      active: row.active === 'true'
    });
  }
});

Given('TODOs with the following details exist', async function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    await createTodo({
      title: row.title,
      doneStatus: row.doneStatus === 'true',
      description: row.description
    });
  }
});

Given('a project with id {string} does not exist', async function (projectId) {
  const res = await axios.get(`${BASE_URL}/projects/${projectId}`, { validateStatus: () => true });
  assert.strictEqual(res.status, 404, `Expected project ${projectId} to not exist but it does`);
});

Given('TODOs with titles associated with courses', async function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    const todo = await getTodoByTitle(row.title);
    const project = await getProjectByTitle(row.course);
    assert.ok(todo, `TODO "${row.title}" not found`);
    assert.ok(project, `Project "${row.course}" not found`);
    await addTaskToProject(project.id, todo.id);
  }
});

// ── Shared notification steps ─────────────────────────────────────────────────

Then('the student is notified of the completion of the creation operation', function () {
  assert.strictEqual(this.lastResponse.status, 201);
});

Then('the student is notified of the completion of the update operation', function () {
  assert.strictEqual(this.lastResponse.status, 200);
});

Then('the student is notified of the completion of the deletion operation', function () {
  assert.strictEqual(this.lastResponse.status, 200);
});

Then('the student is notified of the completion of the query operation', function () {
  assert.strictEqual(this.lastResponse.status, 200);
});

Then('the student is notified of the failed validation with a message {string}', function (message) {
  assert.strictEqual(this.lastResponse.status, 400);
  const errors = this.lastResponse.data.errorMessages || [];
  assert.ok(
    errors.some(e => e.includes(message.replace(/"/g, ''))),
    `Expected error message "${message}" but got: ${JSON.stringify(errors)}`
  );
});

Then('the student is notified of the non-existence error with a message {string}', function (message) {
  assert.strictEqual(this.lastResponse.status, 404);
  const errors = this.lastResponse.data.errorMessages || [];
  assert.ok(
    errors.some(e => e.includes(message.replace(/"/g, ''))),
    `Expected error message "${message}" but got: ${JSON.stringify(errors)}`
  );
});

Then('the student is notified that the service is unavailable', function () {
  assert.ok(
    this.lastResponse.status === 503 || this.lastResponse.error,
    'Expected service to be unavailable but got a successful response'
  );
});
