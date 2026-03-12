const { When } = require('@cucumber/cucumber');
const assert = require('assert');
const { getTodoByTitle, createTodo, updateTodo } = require('./api');

When(
  'the student updates the TODO with title {string} to have description {string}',
  async function (title, newDescription) {
    const todo = await getTodoByTitle(title.replace(/"/g, ''));
    assert.ok(todo, `TODO ${title} not found`);
    this.lastResponse = await updateTodo(todo.id, { description: newDescription.replace(/"/g, '') });
  }
);

When(
  'the student renames the TODO from title {string} to new title {string} and description {string}',
  async function (oldTitle, newTitle, newDescription) {
    const todo = await getTodoByTitle(oldTitle.replace(/"/g, ''));
    assert.ok(todo, `TODO ${oldTitle} not found`);
    this.lastResponse = await updateTodo(todo.id, {
      title: newTitle.replace(/"/g, ''),
      description: newDescription.replace(/"/g, '')
    });
  }
);

When(
  'the student attempts to update the TODO with title {string} to have invalid payload',
  async function (title) {
    // For invalid payload, send empty body which should trigger validation error
    const todo = await getTodoByTitle(title.replace(/"/g, ''));
    assert.ok(todo, `TODO ${title} not found`);
    this.lastResponse = await updateTodo(todo.id, {});
  }
);

