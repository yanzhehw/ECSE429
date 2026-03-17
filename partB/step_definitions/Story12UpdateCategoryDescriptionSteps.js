const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { updateCategory, getCategoryByTitle, getCategoryIdByTitle} = require('./api');

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('the student updates the category with title {string} to have description {string}',
  async function (title, newDescription) {
    const categoryId = await getCategoryIdByTitle(title);
    this.lastResponse = await updateCategory(categoryId, { description: newDescription });
  }
);

Then('the category with title {string} exists with description {string}',
  async function (title, newDescription) {
    const category = await getCategoryByTitle(title);
    assert.strictEqual(category.description, newDescription);
  }
);


// ── Alternate Flow ────────────────────────────────────────────────────────────

When('the student renames the category from title {string} to new title {string} and description {string}',
  async function (oldTitle, newTitle, newDescription) {
    const categoryId = await getCategoryIdByTitle(oldTitle);
    this.lastResponse = await updateCategory(categoryId, { 
      title: newTitle, 
      description: newDescription 
    });
  }
);

// ── Error Flow ────────────────────────────────────────────────────────────────

When('the student attempts to update the category with invalid title {string}',
  async function (title) {
    this.lastResponse = await updateCategory('invalid-id', { title });
  }
);