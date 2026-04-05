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
