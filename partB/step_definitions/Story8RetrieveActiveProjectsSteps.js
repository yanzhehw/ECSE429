const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { getAllProjects, getProjectByTitle, updateProject, createProject } = require('./api');

// ── Given ─────────────────────────────────────────────────────────────────────

Given('a project with title {string} exists with active set to {string} and completed set to {string}',
  async function (title, active, completed) {
    const project = await getProjectByTitle(title);
    assert.ok(project, `Project "${title}" not found`);
    await updateProject(project.id, {
      active: active === 'true',
      completed: completed === 'true'
    });
  }
);

// ── Normal Flow ───────────────────────────────────────────────────────────────

When('the student requests to query all projects with active set to {string} and completed set to {string}',
  async function (active, completed) {
    this.lastResponse = await getAllProjects({ active, completed });
  }
);

When('the student requests to query all projects with invalid active value {string}',
  async function (badActive) {
    this.lastResponse = await createProject({ title: 'Test Project', active: badActive });
  }
);

Then('the system returns only projects where active is {string} and completed is {string}',
  async function (active, completed) {
    assert.strictEqual(this.lastResponse.status, 200);
    const projects = this.lastResponse.data.projects || [];
    assert.ok(projects.length > 0, 'Expected at least one project in results');
    for (const project of projects) {
      assert.strictEqual(project.active, active,
        `Project "${project.title}" has unexpected active value`);
      assert.strictEqual(project.completed, completed,
        `Project "${project.title}" has unexpected completed value`);
    }
  }
);

// ── Alternate Flow ────────────────────────────────────────────────────────────

When('the student requests to query all projects with active set to {string}',
  async function (active) {
    this.lastResponse = await getAllProjects({ active });
  }
);

Then('the system returns projects including ones where active is {string} and completed is {string}',
  async function (active, completed) {
    assert.strictEqual(this.lastResponse.status, 200);
    const projects = this.lastResponse.data.projects || [];
    const contradictory = projects.find(p => p.active === active && p.completed === completed);
    assert.ok(
      contradictory,
      `Expected at least one project with active=${active} and completed=${completed}`
    );
  }
);

