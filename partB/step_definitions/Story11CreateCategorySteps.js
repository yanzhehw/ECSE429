const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { createCategory } = require('./api');

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('a student creates a new category with {string}, {string}, and {string}',
  async function (id, title, description) {
    this.lastResponse = await createCategory({
      id,
      title,
      description
    });
  }
);

Then('the category is created with {string}, {string}, and {string}',
  async function (id, title, description) {
    assert.strictEqual(this.lastResponse.status, 201);
    const category = this.lastResponse.data;
    assert.strictEqual(category.id, id);
    assert.strictEqual(category.title, title);
    assert.strictEqual(category.description, description);
  }
);

Then('the student is notified of the completion of the creation operation',
  async function () {
    assert.ok(this.lastResponse.status === 201 || this.lastResponse.status === 200);
  }
);

// ── Alternate Flow ────────────────────────────────────────────────────────────

When('a student creates a new category with {string}, and {string}',
  async function (id, title) {
    this.lastResponse = await createCategory({
      id,
      title
    });
  }
);

Then('the category is created with {string}, and {string}',
  async function (id, title) {
    assert.strictEqual(this.lastResponse.status, 201);
    const category = this.lastResponse.data;
    assert.strictEqual(category.id, id);
    assert.strictEqual(category.title, title);
  }
);

// ── Error Flow ────────────────────────────────────────────────────────────────

When('a student creates a new course todo list with {string} and {string}',
  async function (id, description) {
    this.lastResponse = await createCategory({
      id,
      description
    });
  }
);

Then('the student is notified of the failed validation with a message {string}',
  async function (message) {
    assert.strictEqual(this.lastResponse.status, 400);
    assert.strictEqual(this.lastResponse.data.errorMessages[0], message);
  }
);
