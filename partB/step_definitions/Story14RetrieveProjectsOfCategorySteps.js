const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { addCategoryToProject, 
  getProjectsByCategory, 
  getCategoryIdByTitle, 
  getProjectIdByTitle,
  getProjectCategories } = require('./api');


// ── Normal Flow ───────────────────────────────────────────────────────────────

When('the student retrieves all projects with active set to {string} and assigned to category with title {string}',
  async function (active, categoryTitle) {
    const categoryId = await getCategoryIdByTitle(categoryTitle);
    this.lastResponse = await getProjectsByCategory(categoryId, { active: active === 'true' });
  }
);


// ── Alternate Flow ────────────────────────────────────────────────────────────


When('the student retrieves all projects assigned to category with title {string}',
  async function (categoryTitle) {
    const categoryId = await getCategoryIdByTitle(categoryTitle);
    this.lastResponse = await getProjectsByCategory(categoryId);
  }
);

Then('the category with title {string} is added as a task of the course todo list with name {string}',
  async function (categoryTitle, projectTitle) {
    const projectId = await getProjectIdByTitle(projectTitle);
    const res = await getProjectCategories(projectId);

    const categories = res.data.categories || []; 
    
    const hasCategory = categories.some(c => c.title === categoryTitle);
    assert.strictEqual(hasCategory, true, `Category ${categoryTitle} not found in project ${projectTitle}`);
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