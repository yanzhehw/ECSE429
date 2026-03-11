const { Before, After } = require('@cucumber/cucumber');
const axios = require('axios');

const BASE_URL = 'http://localhost:4567';

// Track IDs of resources created during each scenario for cleanup
global.createdTodoIds = [];
global.createdProjectIds = [];

global.registerTodo = (id) => global.createdTodoIds.push(id);
global.registerProject = (id) => global.createdProjectIds.push(id);

// Verify server is running before every scenario
Before(async function () {
  try {
    await axios.get(`${BASE_URL}/projects`, { validateStatus: () => true });
  } catch (error) {
    throw new Error(
      `Server is not running at ${BASE_URL}. Please start the Todo Manager before running tests.`
    );
  }
  global.createdTodoIds = [];
  global.createdProjectIds = [];
});

// Restore system to initial state after every scenario
After(async function () {
  for (const id of global.createdTodoIds) {
    try {
      await axios.delete(`${BASE_URL}/todos/${id}`, { validateStatus: () => true });
    } catch (_) {}
  }
  for (const id of global.createdProjectIds) {
    try {
      await axios.delete(`${BASE_URL}/projects/${id}`, { validateStatus: () => true });
    } catch (_) {}
  }
});
