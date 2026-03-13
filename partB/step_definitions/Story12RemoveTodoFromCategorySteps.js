const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  getTodoByTitle,
  getCategoryByTitle,
  addCategoryToTodo,
  removeCategoryFromTodo,
  getTodoCategories
} = require('./api');

// ── Background setup ──────────────────────────────────────────────────────────

Given('TODOs with titles associated with categories', async function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    const todo = await getTodoByTitle(row.title);
    const category = await getCategoryByTitle(row.category);
    assert.ok(todo, `TODO "${row.title}" not found`);
    assert.ok(category, `Category "${row.category}" not found`);
    await addCategoryToTodo(todo.id, category.id);
  }
});

// ── Given ─────────────────────────────────────────────────────────────────────

Given('a TODO with title {string} is not associated with the category with title {string}',
  async function (todoTitle, categoryTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const category = await getCategoryByTitle(categoryTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(category, `Category "${categoryTitle}" not found`);
    const res = await getTodoCategories(todo.id);
    const categories = res.data.categories || [];
    const alreadyAssociated = categories.find(c => c.id === category.id);
    assert.ok(
      !alreadyAssociated,
      `TODO "${todoTitle}" is already associated with category "${categoryTitle}"`
    );
  }
);

// ── When ──────────────────────────────────────────────────────────────────────

When('a student removes the category with title {string} from a TODO with title {string}',
  async function (categoryTitle, todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const category = await getCategoryByTitle(categoryTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(category, `Category "${categoryTitle}" not found`);
    this.lastResponse = await removeCategoryFromTodo(todo.id, category.id);
  }
);

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the TODO with title {string} can no longer see the category with title {string}',
  async function (todoTitle, categoryTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const category = await getCategoryByTitle(categoryTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(category, `Category "${categoryTitle}" not found`);
    const res = await getTodoCategories(todo.id);
    const categories = res.data.categories || [];
    const stillPresent = categories.find(c => c.id === category.id);
    assert.ok(
      !stillPresent,
      `Category "${categoryTitle}" is still visible from TODO "${todoTitle}" after removal`
    );
  }
);
