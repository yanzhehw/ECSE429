# ECSE 429 - Part B: Story Testing

## Setup
```bash
npm install
```

## Running the Tests

Start the server:
```bash
java -jar runTodoManagerRestAPI-1.5.5.jar
```

Run tests:
```bash
npm test
```

Run tests in random order:
```bash
npm run test:random
```

> All tests will fail immediately if the server is not running on `http://localhost:4567`.
> Each scenario restores the system to its initial state after completion, so tests can run in any order.
> An HTML report is generated at `reports/cucumber-report.html` after each run.
> `node_modules/` is excluded from the repository. Always run `npm install` before running tests on a fresh clone.

---

## For Teammates — Adding New Stories

The infrastructure is already set up. Stories 6–10 (Projects) are implemented as a reference.

### Files to ADD
- A new `.feature` file in `features/` for each story (e.g. `Story1PrioritizeTODOs.feature`)
- A new step definition file in `step_definitions/` for each story (e.g. `Story1PrioritizeTODOsSteps.js`)

### Files to MODIFY
- **`step_definitions/api.js`** — add any new API helper functions your stories need (e.g. category endpoints like `/categories`, `/todos/:id/categories`). Follow the same pattern as the existing helpers.
- **`step_definitions/sharedSteps.js`** — add any `Given/When/Then` steps that are reused across multiple stories. Do not duplicate steps across individual step files.
- **`step_definitions/hooks.js`** — if your stories create **categories**, add category tracking the same way todos and projects are tracked:
  ```js
  global.createdCategoryIds = [];
  global.registerCategory = (id) => global.createdCategoryIds.push(id);
  ```
  And add cleanup in the `After` hook:
  ```js
  for (const id of global.createdCategoryIds) {
    try {
      await axios.delete(`${BASE_URL}/categories/${id}`, { validateStatus: () => true });
    } catch (_) {}
  }
  ```

### Files to NOT touch
- `cucumber.js` — already picks up all feature and step files automatically
- `package.json` — no new dependencies needed

### Important rules
- Always use `this.lastResponse` (not a global variable) to store API responses in step definitions
- Each scenario must restore system state — register all created resources using `global.registerTodo()`, `global.registerProject()`, or `global.registerCategory()` so the `After` hook can clean them up
- Use `99999` as the non-existent ID in error flow scenarios to avoid conflicts when running in random order
- Do not redefine steps that already exist in `sharedSteps.js` (e.g. `the server is running`, `TODOs with the following details exist`, `course todo list projects with the following details exist`, and all notification steps)
