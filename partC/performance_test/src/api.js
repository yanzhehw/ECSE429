// ── Instrumented API client ───────────────────────────────────────────────────
// Every function returns { durationMs, status, data } so callers can record
// timing without mixing measurement logic into business logic.

const axios = require("axios");

const BASE_URL = "http://localhost:4567";
const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/** High-resolution timestamp in milliseconds (float). */
function nowMs() {
  return Number(process.hrtime.bigint()) / 1_000_000;
}

/**
 * Wrap an axios call with timing instrumentation.
 * Returns { durationMs, status, data }.
 */
async function timed(fn) {
  const start = nowMs();
  const res = await fn();
  const durationMs = nowMs() - start;
  return { durationMs, status: res.status, data: res.data };
}

const axiosOpts = { headers: HEADERS, validateStatus: () => true };

// ── Todos ─────────────────────────────────────────────────────────────────────

async function createTodo(payload) {
  return timed(() => axios.post(`${BASE_URL}/todos`, payload, axiosOpts));
}

async function updateTodo(id, payload) {
  return timed(() => axios.post(`${BASE_URL}/todos/${id}`, payload, axiosOpts));
}

async function deleteTodo(id) {
  return timed(() => axios.delete(`${BASE_URL}/todos/${id}`, axiosOpts));
}

// ── Projects ──────────────────────────────────────────────────────────────────

async function createProject(payload) {
  return timed(() => axios.post(`${BASE_URL}/projects`, payload, axiosOpts));
}

async function updateProject(id, payload) {
  return timed(() => axios.post(`${BASE_URL}/projects/${id}`, payload, axiosOpts));
}

async function deleteProject(id) {
  return timed(() => axios.delete(`${BASE_URL}/projects/${id}`, axiosOpts));
}

// ── Categories ────────────────────────────────────────────────────────────────

async function createCategory(payload) {
  return timed(() => axios.post(`${BASE_URL}/categories`, payload, axiosOpts));
}

async function updateCategory(id, payload) {
  return timed(() => axios.post(`${BASE_URL}/categories/${id}`, payload, axiosOpts));
}

async function deleteCategory(id) {
  return timed(() => axios.delete(`${BASE_URL}/categories/${id}`, axiosOpts));
}

// ── Health check ──────────────────────────────────────────────────────────────

async function ping() {
  return axios.get(`${BASE_URL}/todos`, { ...axiosOpts, timeout: 500 });
}

module.exports = {
  createTodo, updateTodo, deleteTodo,
  createProject, updateProject, deleteProject,
  createCategory, updateCategory, deleteCategory,
  ping,
};
