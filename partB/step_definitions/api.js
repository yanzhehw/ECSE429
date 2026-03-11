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

async function getProjectTasks(projectId) {
  return request('GET', `/projects/${projectId}/tasks`);
}

async function addTaskToProject(projectId, todoId) {
  return request('POST', `/projects/${projectId}/tasks`, { id: todoId });
}

async function removeTaskFromProject(projectId, todoId) {
  return request('DELETE', `/projects/${projectId}/tasks/${todoId}`);
}

module.exports = {
  getAllProjects,
  getProjectByTitle,
  createProject,
  updateProject,
  deleteProject,
  getAllTodos,
  getTodoByTitle,
  createTodo,
  updateTodo,
  getProjectTasks,
  addTaskToProject,
  removeTaskFromProject
};
