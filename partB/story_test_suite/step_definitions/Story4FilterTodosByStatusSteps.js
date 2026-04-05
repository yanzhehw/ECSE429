const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { getAllTodos, request } = require('./api');

When(
  'the student requests all TODOs with doneStatus {string}',
  async function (status) {
    const boolStatus = status === 'true';
    this.lastResponse = await getAllTodos({ doneStatus: boolStatus });
  }
);

When(
  'the student requests all TODOs with invalid doneStatus {string}',
  async function (status) {
    // use low-level request to send invalid string without converting to boolean
    const res = await request('GET', `/todos?doneStatus=${status}`);
    this.lastResponse = res;
  }
);

Then(
  'the response contains only TODOs with doneStatus {string}',
  function (status) {
    const expected = status.replace(/"/g, '');
    const todos = this.lastResponse.data.todos || [];
    assert.ok(todos.length >= 0);
    for (const todo of todos) {
      assert.strictEqual(
        String(todo.doneStatus),
        expected,
        `Expected todo ${todo.title} to have doneStatus ${expected} but got ${todo.doneStatus}`
      );
    }
  }
);

