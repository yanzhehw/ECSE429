const axios = require('axios');

const BASE_URL = 'http://localhost:4567';

// Never throws on HTTP error codes — only throws if server is unreachable
async function request(method, path, body = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${path}`,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    };
    if (body) config.data = body;
    return await axios(config);
  } catch (error) {
    throw new Error(`Service unavailable: ${error.message}`);
  }
}
async function getAllCategories(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request('GET', `/categories${query ? '?' + query : ''}`);
}

async function getCategoryByTitle(title) {
  const res = await getAllCategories({ title });
  const categories = res.data.projects || [];
  return categories.find(c => c.title === title) || null;
}

async function createCategory(body) {
  const res = await request('POST', '/categories', body);
  if (res.status === 201) global.registerCategory(res.data.id);
  return res;
}

async function updateCategory(id, body) {
  return request('POST', `/categories/${id}`, body);
}

async function deleteCategory(id) {
  return request('DELETE', `/categories/${id}`);
}

async function getAllProjects(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request('GET', `/projects${query ? '?' + query : ''}`);
}

async function getProjectByTitle(title) {
  const res = await getAllProjects({ title });
  const projects = res.data.projects || [];
  return projects.find(p => p.title === title) || null;
}

async function createProject(body) {
  const res = await request('POST', '/projects', body);
  if (res.status === 201) global.registerProject(res.data.id);
  return res;
}

async function updateProject(id, body) {
  return request('POST', `/projects/${id}`, body);
}

async function deleteProject(id) {
  return request('DELETE', `/projects/${id}`);
}

async function getAllTodos(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request('GET', `/todos${query ? '?' + query : ''}`);
}

async function getTodoById(id) {
  return request('GET', `/todos/${id}`);
}

async function getTodoByTitle(title) {
  const res = await getAllTodos({ title });
  const todos = res.data.todos || [];
  return todos.find(t => t.title === title) || null;
}

async function createTodo(body) {
  const res = await request('POST', '/todos', body);
  if (res.status === 201) global.registerTodo(res.data.id);
  return res;
}

async function updateTodo(id, body) {
  return request('POST', `/todos/${id}`, body);
}

async function deleteTodo(id) {
  return request('DELETE', `/todos/${id}`);
}

async function getProjectTasks(projectId) {
  return request('GET', `/projects/${projectId}/tasks`);
}

async function addTaskToProject(projectId, todoId) {
  return request('POST', `/projects/${projectId}/tasks`, { id: todoId });
}

async function removeTaskFromProject(projectId, todoId) {
  return request('DELETE', `/projects/${projectId}/tasks/${todoId}`);
}

async function getAllCategories(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request('GET', `/categories${query ? '?' + query : ''}`);
}

async function getCategoryByTitle(title) {
  const res = await getAllCategories({ title });
  const categories = res.data.categories || [];
  return categories.find(c => c.title === title) || null;
}

async function createCategory(body) {
  const res = await request('POST', '/categories', body);
  if (res.status === 201) global.registerCategory(res.data.id);
  return res;
}

async function getTodoCategories(todoId) {
  return request('GET', `/todos/${todoId}/categories`);
}

async function addCategoryToTodo(todoId, categoryId) {
  return request('POST', `/todos/${todoId}/categories`, { id: categoryId });
}

async function removeCategoryFromTodo(todoId, categoryId) {
  return request('DELETE', `/todos/${todoId}/categories/${categoryId}`);
}

async function getCategoryTodos(categoryId) {
  return request('GET', `/categories/${categoryId}/todos`);
}

async function getTodoProjects(todoId) {
  return request('GET', `/todos/${todoId}/tasksof`);
}

async function addProjectToTodo(todoId, projectId) {
  return request('POST', `/todos/${todoId}/tasksof`, { id: projectId });
}

module.exports = {
  request,
  getAllProjects,
  getProjectByTitle,
  createProject,
  updateProject,
  deleteProject,
  getAllTodos,
  getTodoById,
  getTodoByTitle,
  createTodo,
  updateTodo,
  deleteTodo,
  getProjectTasks,
  addTaskToProject,
  removeTaskFromProject,
  getAllCategories,
  getCategoryByTitle,
  createCategory,
  getTodoCategories,
  addCategoryToTodo,
  removeCategoryFromTodo,
  getCategoryTodos,
  getTodoProjects,
  addProjectToTodo
};
