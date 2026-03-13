const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  getTodoByTitle,
  getCategoryByTitle,
  createCategory,
  addCategoryToTodo,
  getTodoCategories,
  getCategoryTodos
} = require('./api');

// ── Background setup ──────────────────────────────────────────────────────────

Given('categories with the following details exist', async function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    await createCategory({ title: row.title, description: row.description });
  }
});

// ── Given ─────────────────────────────────────────────────────────────────────

Given('the student creates a category with title {string} and description {string}',
  async function (title, description) {
    const res = await createCategory({ title, description });
    assert.strictEqual(res.status, 201);
  }
);

Given('a TODO with id {string} does not exist', async function (_todoId) {
  // Using a very high ID that will never be assigned by the API
});

// ── When ──────────────────────────────────────────────────────────────────────

When('a student adds a category with title {string} to a TODO with title {string}',
  async function (categoryTitle, todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const category = await getCategoryByTitle(categoryTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(category, `Category "${categoryTitle}" not found`);
    this.lastResponse = await addCategoryToTodo(todo.id, category.id);
  }
);

When('a student adds a category with title {string} to a TODO with id {string}',
  async function (categoryTitle, todoId) {
    const category = await getCategoryByTitle(categoryTitle);
    assert.ok(category, `Category "${categoryTitle}" not found`);
    this.lastResponse = await addCategoryToTodo(todoId, category.id);
  }
);

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the TODO with title {string} can see the category with title {string}',
  async function (todoTitle, categoryTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const category = await getCategoryByTitle(categoryTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(category, `Category "${categoryTitle}" not found`);
    const res = await getTodoCategories(todo.id);
    const categories = res.data.categories || [];
    const found = categories.find(c => c.id === category.id);
    assert.ok(found, `Category "${categoryTitle}" not visible from TODO "${todoTitle}"`);
  }
);

Then('the category with title {string} cannot see the TODO with title {string}',
  async function (categoryTitle, todoTitle) {
    const todo = await getTodoByTitle(todoTitle);
    const category = await getCategoryByTitle(categoryTitle);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(category, `Category "${categoryTitle}" not found`);
    const res = await getCategoryTodos(category.id);
    const todos = res.data.todos || [];
    const found = todos.find(t => t.id === todo.id);
    assert.ok(!found, `TODO "${todoTitle}" is unexpectedly visible from category "${categoryTitle}"`);
  }
);
