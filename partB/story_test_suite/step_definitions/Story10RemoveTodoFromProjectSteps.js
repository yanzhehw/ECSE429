const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  getTodoByTitle,
  getProjectByTitle,
  updateTodo,
  removeTaskFromProject,
  getProjectTasks
} = require('./api');

// ── Given ─────────────────────────────────────────────────────────────────────

Given('the student assigns a doneStatus {string} to a TODO with title {string}',
  async function (doneStatus, title) {
    const todo = await getTodoByTitle(title);
    assert.ok(todo, `TODO "${title}" not found`);
    const res = await updateTodo(todo.id, { doneStatus: doneStatus === 'true' });
    assert.strictEqual(res.status, 200);
  }
);

Given('a TODO with title {string} is not associated with the course todo list with name {string}',
  async function (todoTitle, projectName) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    const tasksRes = await getProjectTasks(project.id);
    const tasks = tasksRes.data.todos || [];
    const alreadyAssociated = tasks.find(t => t.id === todo.id);
    assert.ok(
      !alreadyAssociated,
      `TODO "${todoTitle}" is already associated with project "${projectName}"`
    );
  }
);

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('a student removes a TODO with title {string} from a course todo list with name {string}',
  async function (todoTitle, projectName) {
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    assert.ok(todo, `TODO "${todoTitle}" not found`);
    assert.ok(project, `Project "${projectName}" not found`);
    this.lastResponse = await removeTaskFromProject(project.id, todo.id);
  }
);

Then('the TODO with title {string} is removed from the course todo list with name {string}',
  async function (todoTitle, projectName) {
    assert.strictEqual(this.lastResponse.status, 200);
    const todo = await getTodoByTitle(todoTitle);
    const project = await getProjectByTitle(projectName);
    const tasksRes = await getProjectTasks(project.id);
    const tasks = tasksRes.data.todos || [];
    const stillPresent = tasks.find(t => t.id === todo.id);
    assert.ok(
      !stillPresent,
      `TODO "${todoTitle}" is still present in project "${projectName}" after removal`
    );
  }
);
