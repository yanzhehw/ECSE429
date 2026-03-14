const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { createProject } = require('./api');

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('a student creates a new course todo list with {string}, {string}, {string}, and {string}',
  async function (title, completed, description, active) {
    this.lastResponse = await createProject({
      title,
      completed: completed === 'true',
      description,
      active: active === 'true'
    });
  }
);

Then('the course todo list is created with {string}, {string}, {string}, and {string}',
  async function (title, completed, description, active) {
    assert.strictEqual(this.lastResponse.status, 201);
    const project = this.lastResponse.data;
    assert.strictEqual(project.title, title);
    assert.strictEqual(project.completed, completed);
    assert.strictEqual(project.description, description);
    assert.strictEqual(project.active, active);
  }
);

// ── Alternate Flow ────────────────────────────────────────────────────────────

When('a student creates a new course todo list with {string}, {string}, and {string}',
  async function (title, completed, active) {
    this.lastResponse = await createProject({
      title,
      completed: completed === 'true',
      active: active === 'true'
    });
  }
);

Then('the course todo list is created with {string}, {string}, and {string}',
  async function (title, completed, active) {
    assert.strictEqual(this.lastResponse.status, 201);
    const project = this.lastResponse.data;
    assert.strictEqual(project.title, title);
    assert.strictEqual(project.completed, completed);
    assert.strictEqual(project.active, active);
    assert.strictEqual(project.description, '');
  }
);

// ── Error Flow ────────────────────────────────────────────────────────────────

When('a student creates a new course todo list with {string}, {string}, and wrong {string}',
  async function (title, description, badCompleted) {
    this.lastResponse = await createProject({
      title,
      description,
      completed: badCompleted
    });
  }
);
