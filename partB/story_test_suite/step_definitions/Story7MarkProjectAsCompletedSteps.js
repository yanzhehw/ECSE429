const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { getProjectByTitle, updateProject } = require('./api');

// ── Given ─────────────────────────────────────────────────────────────────────

Given('student is registered in the class with title {string}', async function (title) {
  const project = await getProjectByTitle(title);
  assert.ok(project, `Project "${title}" not found in background setup`);
});

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('the student requests to mark the project with title {string} as completed and inactive',
  async function (title) {
    const project = await getProjectByTitle(title);
    assert.ok(project, `Project "${title}" not found`);
    this.lastResponse = await updateProject(project.id, { completed: true, active: false });
  }
);

Then('the project with title {string} has completed set to {string} and active set to {string}',
  async function (title, expectedCompleted, expectedActive) {
    assert.strictEqual(this.lastResponse.status, 200);
    const project = this.lastResponse.data;
    assert.strictEqual(project.completed, expectedCompleted);
    assert.strictEqual(project.active, expectedActive);
  }
);

// ── Alternate Flow ────────────────────────────────────────────────────────────

When('the student requests to mark the project with title {string} as completed only',
  async function (title) {
    const project = await getProjectByTitle(title);
    assert.ok(project, `Project "${title}" not found`);
    this.lastResponse = await updateProject(project.id, { completed: true });
  }
);

// ── Error Flow ────────────────────────────────────────────────────────────────

When('the student requests to mark the project with id {string} as completed and inactive',
  async function (projectId) {
    this.lastResponse = await updateProject(projectId, { completed: true, active: false });
  }
);
