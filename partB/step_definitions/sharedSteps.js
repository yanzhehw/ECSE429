const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const {
  createProject,
  createTodo,
  getTodoByTitle,
  getProjectByTitle,
  addTaskToProject,
  getCategoryByTitle,
  addCategoryToProject,
  getCategoryIdByTitle,
  getProjectIdByTitle
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
    const res = await createProject({
      title: row.title,
      completed: row.completed === 'true',
      description: row.description,
      active: row.active === 'true'
    });
    if (row.category && row.category !== 'None') {
      const category = await getCategoryByTitle(row.category);
      if (category) {
        await addCategoryToProject(res.data.id, category.id);
      }
    }
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
  // Using a very high ID that will never be assigned by the API
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
  const status = this.lastResponse.status;
  assert.ok(status === 404 || status === 200, `Expected 404 or 200 but got ${status}`);
  
  const errors = JSON.stringify(this.lastResponse.data);
  const cleanMessage = message.replace(/"/g, '');
  
  assert.ok(
    errors.includes(cleanMessage),
    `Expected error message "${cleanMessage}" but got: ${errors}`
  );
});


Then('the student is notified that the service is unavailable', function () {
  assert.ok(
    this.lastResponse.status === 503 || this.lastResponse.error,
    'Expected service to be unavailable but got a successful response'
  );
});
Then('the system returns only projects where active is {string} and completed is {string}',
  async function (active, completed) {
    assert.strictEqual(this.lastResponse.status, 200);
    const projects = this.lastResponse.data.projects || [];

    const expectedActive = active === 'true';
    const expectedCompleted = completed === 'true';

    assert.ok(projects.length > 0, 'Expected at least one project in results');
    
    for (const project of projects) {

      assert.strictEqual(Boolean(project.active), expectedActive, `Project "${project.title}" active mismatch`);
      assert.strictEqual(Boolean(project.completed), expectedCompleted, `Project "${project.title}" completed mismatch`);
    }
  }
);

Then('the system returns only projects where active is {string}', async function (activeStatus) {
    assert.strictEqual(this.lastResponse.status, 200);
    const projects = this.lastResponse.data.projects || [];
    
    const expectedActive = activeStatus === 'true';

    assert.ok(projects.length > 0, "Expected to find at least one project");
    
    for (const project of projects) {
      
        assert.strictEqual(project.active === 'true' || project.active === true, expectedActive);
    }
});
When('a student adds a category with title {string} to a project with title {string}', 
  async function (categoryTitle, projectTitle) {
    const categoryId = await getCategoryIdByTitle(categoryTitle)|| "99999";;
    const projectId = await getProjectIdByTitle(projectTitle)|| "project2";;
    this.lastResponse = await addCategoryToProject(projectId, categoryId);
  }
  
);
Given('a project with title {string} does not exist', async function (projectTitle) {
    const project = await getProjectByTitle(projectTitle);
    if (project) {
        await deleteProject(project.id);
    }
});