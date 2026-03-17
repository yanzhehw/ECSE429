const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { getTodoByTitle, deleteTodo } = require('./api');

When('the student deletes the TODO with title {string}', async function (title) {
  const todo = await getTodoByTitle(title.replace(/"/g, ''));
  assert.ok(todo, `TODO ${title} not found`);
  this.lastResponse = await deleteTodo(todo.id);
});

When(
  'the student deletes the TODO with title {string} and the TODO with title {string}',
  async function (firstTitle, secondTitle) {
    const first = await getTodoByTitle(firstTitle.replace(/"/g, ''));
    assert.ok(first, `TODO ${firstTitle} not found`);
    await deleteTodo(first.id);
    const second = await getTodoByTitle(secondTitle.replace(/"/g, ''));
    assert.ok(second, `TODO ${secondTitle} not found`);
    this.lastResponse = await deleteTodo(second.id);
  }
);

When(
  'the student attempts to delete the TODO with id {string}',
  async function (todoId) {
    this.lastResponse = await deleteTodo(todoId);
  }
);

Then('the TODO with title {string} no longer exists', async function (title) {
  const todo = await getTodoByTitle(title.replace(/"/g, ''));
  assert.strictEqual(todo, null);
});

