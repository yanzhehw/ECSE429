const axios = require("axios");
const path = require("path");
const { exec, spawn } = require("child_process");

// ── Paths ─────────────────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, "..");
const JAR_PATH = path.join(PROJECT_ROOT, "runTodoManagerRestAPI-1.5.5.jar");

// ── API Configuration ──────────────────────────────────────────────
const BASE_URL = "http://localhost:4567";
const API_PATH = {
  projects: "/projects",
  todos: "/todos",
  categories: "/categories",
};
const RELATIONSHIP = {
  tasks: "tasks",
  tasksof: "tasksof",
  categories: "categories",
  projects: "projects",
};

// ── HTTP Helpers ───────────────────────────────────────────────────
const jsonHeaders = { "Content-Type": "application/json", Accept: "application/json" };
const xmlHeaders = { "Content-Type": "application/xml", Accept: "application/xml" };

function buildUrl(...segments) {
  return BASE_URL + segments.join("/");
}

async function sendGet(path, headers = jsonHeaders) {
  return axios.get(BASE_URL + path, { headers, validateStatus: () => true });
}

async function sendPost(path, data, headers = jsonHeaders) {
  return axios.post(BASE_URL + path, data, { headers, validateStatus: () => true });
}

async function sendPut(path, data, headers = jsonHeaders) {
  return axios.put(BASE_URL + path, data, { headers, validateStatus: () => true });
}

async function sendDelete(path, headers = jsonHeaders) {
  return axios.delete(BASE_URL + path, { headers, validateStatus: () => true });
}

async function sendHead(path, headers = jsonHeaders) {
  return axios.head(BASE_URL + path, { headers, validateStatus: () => true });
}

// ── Server Lifecycle ───────────────────────────────────────────────
let serverProcess = null;

async function startServer() {
  serverProcess = spawn("java", ["-jar", JAR_PATH], {
    detached: false,
    stdio: "ignore",
    cwd: PROJECT_ROOT,
  });

  const maxRetries = 50;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await axios.get(BASE_URL + API_PATH.projects, { timeout: 500 });
      return;
    } catch (_) {
      await sleep(200);
    }
  }
  throw new Error("Server failed to start within timeout");
}

async function shutdownServer() {
  try {
    await axios.get(BASE_URL + "/shutdown", { timeout: 2000 });
  } catch (_) {
    // shutdown endpoint closes connection immediately
  }
  serverProcess = null;
  await sleep(300);
}

async function isServerRunning() {
  try {
    await axios.get(BASE_URL + API_PATH.projects, { timeout: 1000 });
    return true;
  } catch (_) {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Data Snapshot / Restore ────────────────────────────────────────
async function captureSystemState() {
  const [todosRes, projectsRes, categoriesRes] = await Promise.all([
    sendGet(API_PATH.todos),
    sendGet(API_PATH.projects),
    sendGet(API_PATH.categories),
  ]);
  return {
    todos: todosRes.data.todos || [],
    projects: projectsRes.data.projects || [],
    categories: categoriesRes.data.categories || [],
  };
}

// ── XML Utilities ──────────────────────────────────────────────────
function wrapXml(tag, fields) {
  const inner = Object.entries(fields)
    .map(([key, val]) => `<${key}>${val}</${key}>`)
    .join("");
  return `<${tag}>${inner}</${tag}>`;
}

module.exports = {
  BASE_URL,
  API_PATH,
  RELATIONSHIP,
  jsonHeaders,
  xmlHeaders,
  buildUrl,
  sendGet,
  sendPost,
  sendPut,
  sendDelete,
  sendHead,
  startServer,
  shutdownServer,
  isServerRunning,
  captureSystemState,
  wrapXml,
  sleep,
};
