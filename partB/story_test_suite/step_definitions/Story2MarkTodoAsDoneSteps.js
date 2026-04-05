const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { getTodoByTitle, updateTodo, getTodoById } = require('./api');

When('the student marks the TODO with title {string} as done', async function (title) {
  const todo = await getTodoByTitle(title.replace(/"/g, ''));
  assert.ok(todo, `TODO ${title} not found`);
  this.lastResponse = await updateTodo(todo.id, { doneStatus: true });
});

When('the student marks the TODO with title {string} as not done', async function (title) {
  const todo = await getTodoByTitle(title.replace(/"/g, ''));
  assert.ok(todo, `TODO ${title} not found`);
  this.lastResponse = await updateTodo(todo.id, { doneStatus: false });
});

When(
  'the student attempts to mark the TODO with id {string} as done',
  async function (todoId) {
    this.lastResponse = await updateTodo(todoId, { doneStatus: true });
  }
);

Then('the TODO with title {string} has doneStatus {string}', async function (title, status) {
  const todo = await getTodoByTitle(title.replace(/"/g, ''));
  assert.ok(todo, `TODO ${title} not found`);
  assert.strictEqual(String(todo.doneStatus), status.replace(/"/g, ''));
});

