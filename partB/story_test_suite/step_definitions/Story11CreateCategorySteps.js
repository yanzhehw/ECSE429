const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { createCategory } = require('./api');

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('a student creates a new category with {string}, {string}, and {string}',
  async function (id, title, description) {
   
    this.lastResponse = await createCategory({
      title: title,
      description: description
    });
  }
);

Then('the category is created with {string}, {string}, and {string}',
  async function (expectedId, expectedTitle, expectedDescription) {
    assert.strictEqual(this.lastResponse.status, 201, `Expected 201 Created but got ${this.lastResponse.status}`);
    
    const category = this.lastResponse.data;
    
    assert.ok(category.id, "Category should have an auto-generated ID");

    assert.strictEqual(category.title, expectedTitle);
    assert.strictEqual(category.description, expectedDescription);
  }
);

// ── Alternate Flow ────────────────────────────────────────────────────────────

When('a student creates a new category with {string}, and {string}',
  async function (id, title) {
    this.lastResponse = await createCategory({
      title: title
    });
  }
);

Then('the category is created with {string}, and {string}',
  async function (expectedId, expectedTitle) {
    assert.strictEqual(this.lastResponse.status, 201, `Expected 201 Created but got ${this.lastResponse.status}`);
    
    const category = this.lastResponse.data;
    assert.ok(category.id, "Category should have an auto-generated ID");
    assert.strictEqual(category.title, expectedTitle);
  }
);

When('a student attempts to create a category with a missing title NONE', async function () {
  this.lastResponse = await createCategory({
    description: "testing"
  });
});

