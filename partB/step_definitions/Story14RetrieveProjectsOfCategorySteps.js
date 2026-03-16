const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { getProjectsByCategory, getCategoryIdByTitle } = require('./api');


// ── Normal Flow ───────────────────────────────────────────────────────────────

When('the student retrieves all projects with active set to {string} and assigned to category with title {string}',
  async function (active, categoryTitle) {
    const categoryId = await getCategoryIdByTitle(categoryTitle);
    this.lastResponse = await getProjectsByCategory(categoryId, { active: active === 'true' });
  }
);

Then('the system returns only projects where active is {string} and completed is {string}',
  async function (active, completed) {
    assert.strictEqual(this.lastResponse.status, 200);
    const projects = this.lastResponse.data.projects;
    for (const project of projects) {
      assert.strictEqual(String(project.active), active);
      assert.strictEqual(String(project.completed), completed);
    }
  }
);

Then('the student is notified of the completion of the query operation',
  async function () {
    assert.strictEqual(this.lastResponse.status, 200);
  }
);

// ── Alternate Flow ────────────────────────────────────────────────────────────

Given('the student creates a relationship between a category with title {string} and a project with title {string}',
  async function (categoryTitle, projectTitle) {
    const categoryId = await getCategoryIdByTitle(categoryTitle);
    const projectId = await getProjectIdByTitle(projectTitle);
    await addCategoryToProject(projectId, categoryId);
  }
);

When('the student retrieves all projects assigned to category with title {string}',
  async function (categoryTitle) {
    const categoryId = await getCategoryIdByTitle(categoryTitle);
    this.lastResponse = await getProjectsByCategory(categoryId);
  }
);

Then('the category with title {string} is added as a task of the course todo list with name {string}',
  async function (categoryTitle, projectTitle) {
    const projectCategories = await getProjectCategories(projectTitle);
    const hasCategory = projectCategories.some(c => c.title === categoryTitle);
    assert.strictEqual(hasCategory, true);
  }
);

// ── Error Flow ────────────────────────────────────────────────────────────────

Given('a category with title {string} does not exist',
  async function (title) {
    const categoryId = await getCategoryIdByTitle(title);
    if (categoryId) {
      await deleteCategory(categoryId);
    }
  }
);