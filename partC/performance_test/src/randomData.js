// ── Random data generators for performance testing ────────────────────────────
// Each generator returns a plain object matching the API's accepted fields.

const ADJECTIVES = [
  "urgent", "pending", "critical", "routine", "important", "minor",
  "scheduled", "overdue", "optional", "recurring", "delegated", "blocked",
  "active", "archived", "ongoing", "deferred", "approved", "rejected",
];

const NOUNS = [
  "review", "report", "meeting", "task", "invoice", "request",
  "document", "analysis", "update", "submission", "audit", "survey",
  "plan", "budget", "proposal", "ticket", "agenda", "draft",
];

const VERBS = [
  "Complete", "Review", "Submit", "Prepare", "Schedule", "Send",
  "Update", "Finalize", "Check", "Confirm", "Draft", "Approve",
  "Follow up on", "Organize", "Archive", "Assess", "Coordinate", "Deliver",
];

const CONTEXTS = [
  "before Friday", "by end of day", "this sprint", "next quarter",
  "for the client", "for the team", "before the meeting", "as soon as possible",
  "when available", "if needed", "with stakeholders", "after review",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTitle() {
  return `${pick(VERBS)} ${pick(ADJECTIVES)} ${pick(NOUNS)}`;
}

function randomDescription() {
  return `${pick(VERBS)} the ${pick(ADJECTIVES)} ${pick(NOUNS)} ${pick(CONTEXTS)}.`;
}

function randomBool() {
  return Math.random() < 0.5;
}

// ── Object generators ─────────────────────────────────────────────────────────

/**
 * Random todo payload.
 * Fields: title (required), description, doneStatus (boolean)
 */
function randomTodo() {
  return {
    title: randomTitle(),
    description: randomDescription(),
    doneStatus: randomBool(),
  };
}

/**
 * Random partial todo payload for update (POST /todos/:id).
 * Varies all three fields so the update is meaningful.
 */
function randomTodoUpdate() {
  return {
    title: randomTitle(),
    description: randomDescription(),
    doneStatus: randomBool(),
  };
}

/**
 * Random project payload.
 * Fields: title (required), description, active (boolean), completed (boolean).
 * Note: active and completed are independent booleans in this API.
 */
function randomProject() {
  return {
    title: randomTitle(),
    description: randomDescription(),
    active: randomBool(),
    completed: randomBool(),
  };
}

/**
 * Random partial project payload for update.
 * Keeps only safe string fields to avoid boolean-validation errors on update.
 */
function randomProjectUpdate() {
  return {
    title: randomTitle(),
    description: randomDescription(),
  };
}

/**
 * Random category payload.
 * Fields: title (required), description.
 */
function randomCategory() {
  return {
    title: randomTitle(),
    description: randomDescription(),
  };
}

/**
 * Random category update payload.
 */
function randomCategoryUpdate() {
  return {
    title: randomTitle(),
    description: randomDescription(),
  };
}

module.exports = {
  randomTodo,
  randomTodoUpdate,
  randomProject,
  randomProjectUpdate,
  randomCategory,
  randomCategoryUpdate,
};
