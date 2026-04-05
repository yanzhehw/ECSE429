const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
 deleteCategory,
 updateCategory,
 getCategoryIdByTitle,
 getCategoryByTitle
} = require('./api');

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('a student removes a category with title {string}',
  async function (title) {
    const categoryId = await getCategoryIdByTitle(title);
    this.lastResponse = await deleteCategory(categoryId);
  }
);

Then('the category with title {string} is removed from the categories in the todo manager',
  async function (title) {
    const category = await getCategoryByTitle(title);
    assert.strictEqual(category, null);
  }
);


// ── Alternate Flow ────────────────────────────────────────────────────────────

Given('the student assigns new description {string} to a category with title {string}',
  async function (description, title) {
    const categoryId = await getCategoryIdByTitle(title);
    await updateCategory(categoryId, { description });
  }
);

When('a student removes a category with title {string} from the categories in the todo manager',
  async function (title) {
    const categoryId = await getCategoryIdByTitle(title);
    this.lastResponse = await deleteCategory(categoryId);
  }
);

// ── Error Flow ────────────────────────────────────────────────────────────────

When('the student attempts to delete the category with title {string}',
  async function (title) {
    // Attempt deletion of an ID that shouldn't exist
    this.lastResponse = await deleteCategory('99999');
  }
);