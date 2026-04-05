const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { createTodo, getAllTodos, request } = require('./api');

When(
  'the student creates a TODO with title {string}, description {string}, and doneStatus {string}',
  async function (title, description, doneStatus) {
    const body = {
      title,
      description,
      doneStatus: doneStatus === 'true'
    };
    this.lastResponse = await createTodo(body);
  }
);

When('the student creates a TODO with only title {string}', async function (title) {
  const body = { title };
  this.lastResponse = await createTodo(body);
});

When(
  'the student attempts to create a TODO with invalid payload having doneStatus {string}',
  async function (badDoneStatus) {
    const body = {
      title: 'Invalid TODO',
      description: 'Bad doneStatus value',
      doneStatus: badDoneStatus
    };
    // use low-level request so it does not register an invalid id
    const res = await request('POST', '/todos', body);
    this.lastResponse = res;
  }
);

Then(
  'the TODO with title {string} exists with description {string} and doneStatus {string}',
  async function (title, description, doneStatus) {
    const res = await getAllTodos({ title: title.replace(/"/g, '') });
    const todos = res.data.todos || [];
    assert.ok(todos.length > 0, `Expected TODO with title ${title} to exist`);
    const todo = todos[0];
    assert.strictEqual(todo.title, title.replace(/"/g, ''));
    assert.strictEqual(todo.description || '', description.replace(/"/g, ''));
    assert.strictEqual(String(todo.doneStatus), doneStatus.replace(/"/g, ''));
  }
);

