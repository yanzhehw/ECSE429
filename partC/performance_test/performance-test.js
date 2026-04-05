#!/usr/bin/env node
// ── ECSE 429 Part C – Performance Testing ────────────────────────────────────
//
// Runs create / update / delete operations on todos, projects, and categories
// for increasing values of N (number of objects).  Every individual HTTP call
// is timed; mean, min, max, and std-dev are printed in a summary table and
// saved to results/performance-<timestamp>.csv.
//
// Usage:
//   node performance-test.js           # full run: N = 1,10,50,100,500,1000
//   node performance-test.js --quick   # quick run: N = 1,10,50
//   node performance-test.js --n 200   # single N value
// ─────────────────────────────────────────────────────────────────────────────

"use strict";

const { spawn }  = require("child_process");
const path       = require("path");
const fs         = require("fs");
const axios      = require("axios");

const { measureSystem } = require("./src/metrics"); // <-- ADDED: CPU/Mem tracker

const {
  randomTodo, randomTodoUpdate,
  randomProject, randomProjectUpdate,
  randomCategory, randomCategoryUpdate,
} = require("./src/randomData");

const {
  createTodo, updateTodo, deleteTodo,
  createProject, updateProject, deleteProject,
  createCategory, updateCategory, deleteCategory,
  ping,
} = require("./src/api");

// ── Configuration ─────────────────────────────────────────────────────────────

const JAR_PATH = path.resolve(__dirname, "runTodoManagerRestAPI-1.5.5.jar");
const BASE_URL    = "http://localhost:4567";
const RESULTS_DIR = path.join(__dirname, "results");

const FULL_N_VALUES  = [1, 10, 50, 100, 500, 1000];
const QUICK_N_VALUES = [1, 10, 50];

// ── CLI argument parsing ──────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes("--quick")) return QUICK_N_VALUES;
  const nIdx = args.indexOf("--n");
  if (nIdx !== -1 && args[nIdx + 1]) return [Number(args[nIdx + 1])];
  return FULL_N_VALUES;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Compute mean, min, max, stddev from an array of numbers. */
function stats(times) {
  const n    = times.length;
  if (n === 0) return { mean: 0, min: 0, max: 0, stddev: 0 };
  const mean = times.reduce((s, t) => s + t, 0) / n;
  const variance = times.reduce((s, t) => s + (t - mean) ** 2, 0) / n;
  const sorted   = [...times].sort((a, b) => a - b);
  return {
    mean:   mean,
    min:    sorted[0],
    max:    sorted[n - 1],
    stddev: Math.sqrt(variance),
  };
}

function fmt(ms) { return ms.toFixed(3); }

// ── Server lifecycle ──────────────────────────────────────────────────────────

let serverProcess = null;

async function startServer() {
  // CHANGED: We removed the auto-spawn to prevent the ENOENT crash. 
  // You must run the JAR manually in another terminal before running this script.
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      await ping();
      return; // server is up
    } catch (_) {
      await sleep(200);
    }
  }
  throw new Error("\n❌ Server failed to respond. Please start the JAR manually using 'java -jar ...' in another terminal.\n");
}

async function shutdownServer() {
  try {
    await axios.get(`${BASE_URL}/shutdown`, { timeout: 2000 });
  } catch (_) {
    // The shutdown endpoint closes the connection immediately – that's expected.
  }
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
  await sleep(400);
}

// ── Core benchmark for a single N ────────────────────────────────────────────

/**
 * Runs the full create → update → delete cycle for all three entity types
 * at the given N.  Returns a results map:
 * { "todo.create": Stats, "todo.update": Stats, ... }
 */
async function benchmarkN(n) {
  const label = `N = ${n}`;
  process.stdout.write(`\n── ${label} ${"─".repeat(Math.max(0, 44 - label.length))}\n`);

  await startServer();

  const results = {};

  // ── Todos ──────────────────────────────────────────────────────────────────

  const todoIds = [];

  // CREATE
  const todoCreateTimes = [];
  const [todoCreateMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (let i = 0; i < n; i++) {
        const r = await createTodo(randomTodo());
        todoCreateTimes.push(r.durationMs);
        if (r.data && r.data.id) todoIds.push(r.data.id);
      }
    })()
  ]);
  results["todo.create"] = stats(todoCreateTimes);
  results["todo.create"].cpu = todoCreateMetrics.cpuPercent; // <-- Added metric
  results["todo.create"].mem = todoCreateMetrics.freeMemMB;  // <-- Added metric
  process.stdout.write(`  [todos]      create: ${n} ops, mean ${fmt(results["todo.create"].mean)} ms (CPU: ${todoCreateMetrics.cpuPercent}%)\n`);

  // UPDATE
  const todoUpdateTimes = [];
  const [todoUpdateMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (const id of todoIds) {
        const r = await updateTodo(id, randomTodoUpdate());
        todoUpdateTimes.push(r.durationMs);
      }
    })()
  ]);
  results["todo.update"] = stats(todoUpdateTimes);
  results["todo.update"].cpu = todoUpdateMetrics.cpuPercent;
  results["todo.update"].mem = todoUpdateMetrics.freeMemMB;
  process.stdout.write(`  [todos]      update: ${todoIds.length} ops, mean ${fmt(results["todo.update"].mean)} ms (CPU: ${todoUpdateMetrics.cpuPercent}%)\n`);

  // DELETE
  const todoDeleteTimes = [];
  const [todoDeleteMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (const id of todoIds) {
        const r = await deleteTodo(id);
        todoDeleteTimes.push(r.durationMs);
      }
    })()
  ]);
  results["todo.delete"] = stats(todoDeleteTimes);
  results["todo.delete"].cpu = todoDeleteMetrics.cpuPercent;
  results["todo.delete"].mem = todoDeleteMetrics.freeMemMB;
  process.stdout.write(`  [todos]      delete: ${todoIds.length} ops, mean ${fmt(results["todo.delete"].mean)} ms (CPU: ${todoDeleteMetrics.cpuPercent}%)\n`);

  // ── Projects ───────────────────────────────────────────────────────────────

  const projectIds = [];

  // CREATE
  const projectCreateTimes = [];
  const [projectCreateMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (let i = 0; i < n; i++) {
        const r = await createProject(randomProject());
        projectCreateTimes.push(r.durationMs);
        if (r.data && r.data.id) projectIds.push(r.data.id);
      }
    })()
  ]);
  results["project.create"] = stats(projectCreateTimes);
  results["project.create"].cpu = projectCreateMetrics.cpuPercent;
  results["project.create"].mem = projectCreateMetrics.freeMemMB;
  process.stdout.write(`  [projects]   create: ${n} ops, mean ${fmt(results["project.create"].mean)} ms (CPU: ${projectCreateMetrics.cpuPercent}%)\n`);

  // UPDATE
  const projectUpdateTimes = [];
  const [projectUpdateMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (const id of projectIds) {
        const r = await updateProject(id, randomProjectUpdate());
        projectUpdateTimes.push(r.durationMs);
      }
    })()
  ]);
  results["project.update"] = stats(projectUpdateTimes);
  results["project.update"].cpu = projectUpdateMetrics.cpuPercent;
  results["project.update"].mem = projectUpdateMetrics.freeMemMB;
  process.stdout.write(`  [projects]   update: ${projectIds.length} ops, mean ${fmt(results["project.update"].mean)} ms (CPU: ${projectUpdateMetrics.cpuPercent}%)\n`);

  // DELETE
  const projectDeleteTimes = [];
  const [projectDeleteMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (const id of projectIds) {
        const r = await deleteProject(id);
        projectDeleteTimes.push(r.durationMs);
      }
    })()
  ]);
  results["project.delete"] = stats(projectDeleteTimes);
  results["project.delete"].cpu = projectDeleteMetrics.cpuPercent;
  results["project.delete"].mem = projectDeleteMetrics.freeMemMB;
  process.stdout.write(`  [projects]   delete: ${projectIds.length} ops, mean ${fmt(results["project.delete"].mean)} ms (CPU: ${projectDeleteMetrics.cpuPercent}%)\n`);

  // ── Categories ─────────────────────────────────────────────────────────────

  const categoryIds = [];

  // CREATE
  const categoryCreateTimes = [];
  const [catCreateMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (let i = 0; i < n; i++) {
        const r = await createCategory(randomCategory());
        categoryCreateTimes.push(r.durationMs);
        if (r.data && r.data.id) categoryIds.push(r.data.id);
      }
    })()
  ]);
  results["category.create"] = stats(categoryCreateTimes);
  results["category.create"].cpu = catCreateMetrics.cpuPercent;
  results["category.create"].mem = catCreateMetrics.freeMemMB;
  process.stdout.write(`  [categories] create: ${n} ops, mean ${fmt(results["category.create"].mean)} ms (CPU: ${catCreateMetrics.cpuPercent}%)\n`);

  // UPDATE
  const categoryUpdateTimes = [];
  const [catUpdateMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (const id of categoryIds) {
        const r = await updateCategory(id, randomCategoryUpdate());
        categoryUpdateTimes.push(r.durationMs);
      }
    })()
  ]);
  results["category.update"] = stats(categoryUpdateTimes);
  results["category.update"].cpu = catUpdateMetrics.cpuPercent;
  results["category.update"].mem = catUpdateMetrics.freeMemMB;
  process.stdout.write(`  [categories] update: ${categoryIds.length} ops, mean ${fmt(results["category.update"].mean)} ms (CPU: ${catUpdateMetrics.cpuPercent}%)\n`);

  // DELETE
  const categoryDeleteTimes = [];
  const [catDeleteMetrics] = await Promise.all([
    measureSystem(500), 
    (async () => {
      for (const id of categoryIds) {
        const r = await deleteCategory(id);
        categoryDeleteTimes.push(r.durationMs);
      }
    })()
  ]);
  results["category.delete"] = stats(categoryDeleteTimes);
  results["category.delete"].cpu = catDeleteMetrics.cpuPercent;
  results["category.delete"].mem = catDeleteMetrics.freeMemMB;
  process.stdout.write(`  [categories] delete: ${categoryIds.length} ops, mean ${fmt(results["category.delete"].mean)} ms (CPU: ${catDeleteMetrics.cpuPercent}%)\n`);

  // NOTE: Depending on how the Todo Manager handles shutdown, you might need to manually 
  // restart the server between large N tests if it hangs!
  // await shutdownServer();
  return results;
}

// ── Reporting ─────────────────────────────────────────────────────────────────

const OPERATIONS = [
  "todo.create",    "todo.update",    "todo.delete",
  "project.create", "project.update", "project.delete",
  "category.create","category.update","category.delete",
];

const METRIC_LABELS = ["mean", "min", "max", "stddev"];

/**
 * Print a formatted summary table to stdout.
 *
 * Layout: one sub-table per metric, rows = operation, columns = N.
 */
function printTable(allResults) {
  const ns = Object.keys(allResults).map(Number).sort((a, b) => a - b);

  const OP_COL   = 18;
  const VAL_COL  = Math.max(8, ...ns.map((n) => String(n).length + 4));
  const separator = "─".repeat(OP_COL + ns.length * (VAL_COL + 2) + 2);

  for (const metric of METRIC_LABELS) {
    console.log(`\n  ${metric.toUpperCase()} (ms)`);
    const header = ["Operation".padEnd(OP_COL), ...ns.map((n) => `N=${n}`.padStart(VAL_COL))];
    console.log("  " + header.join("  "));
    console.log("  " + separator);
    for (const op of OPERATIONS) {
      const row = [
        op.padEnd(OP_COL),
        ...ns.map((n) => fmt(allResults[n][op][metric]).padStart(VAL_COL)),
      ];
      console.log("  " + row.join("  "));
    }
  }
}

/**
 * Save all results to a CSV file in the results/ directory.
 * Columns: operation, n, mean_ms, min_ms, max_ms, stddev_ms, cpu_percent, free_mem_mb
 */
function saveCSV(allResults) {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const ns        = Object.keys(allResults).map(Number).sort((a, b) => a - b);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filepath  = path.join(RESULTS_DIR, `performance-${timestamp}.csv`);

  // CHANGED: Added cpu_percent and free_mem_mb headers
  const lines = ["operation,n,mean_ms,min_ms,max_ms,stddev_ms,cpu_percent,free_mem_mb"];
  for (const n of ns) {
    for (const op of OPERATIONS) {
      const s = allResults[n][op];
      // CHANGED: Added s.cpu and s.mem to the CSV output
      lines.push([op, n, fmt(s.mean), fmt(s.min), fmt(s.max), fmt(s.stddev), s.cpu, s.mem].join(","));
    }
  }

  fs.writeFileSync(filepath, lines.join("\n") + "\n");
  return filepath;
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main() {
  const nValues = parseArgs();

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  ECSE 429 – Part C: Performance Testing      ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`  JAR:    ${JAR_PATH} (Please ensure it is running)`);
  console.log(`  N:      ${nValues.join(", ")}`);
  console.log(`  Ops:    create / update / delete`);
  console.log(`  Types:  todos, projects, categories`);

  const allResults = {};
  for (const n of nValues) {
    allResults[n] = await benchmarkN(n);
  }

  console.log("\n\n╔══════════════════════════════════════════════╗");
  console.log("║  RESULTS SUMMARY                             ║");
  console.log("╚══════════════════════════════════════════════╝");
  printTable(allResults);

  const csvPath = saveCSV(allResults);
  console.log(`\n  Results saved → ${csvPath}\n`);
}

main().catch((err) => {
  console.error("\nFatal error:", err.message || err);
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});