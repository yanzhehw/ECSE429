# ECSE429 - Software Validation Term Project

## Team Members

1. **Name:** Emile Labrunie

   - **Student ID:** 261097953
   - **Email:** emile.labrunie@mail.mcgill.ca
2. **Name:** Ethan Wu

   - **Student ID:** 261117309
   - **Email:** ethan.wu2@mail.mcgill.ca
3. **Name:** Kenny Duy Nguyen

   - **Student ID:** 261120429 
   - **Email:** kenny.nguyen@mail.mcgill.ca
4. **Name:** Yanzhe Zhang

   - **Student ID:** 261016377
   - **Email:** yanzhe.zhang@mail.mcgill.ca

---

## Part A: Exploratory Testing of REST API

### Project Overview

This project focuses on exploratory testing and unit testing of a REST API Todo List Manager application. The application under test is a "rest api todo list manager" that runs as a localhost service, made available by Alan Richardson and found at: https://github.com/eviltester/thingifier/releases

**Application Launch Command:**

```bash
java -jar runTodoManagerRestAPI-1.5.5.jar
```

**Documentation:**

- Basic API documentation: http://localhost:4567/docs
- Swagger description: http://localhost:4567/docs/swagger

### Part A Objectives

#### 1. Exploratory Testing

Using **Charter Driven Session Based Exploratory Testing**, team members will:

- Identify capabilities and areas of potential instability of the "rest api todo list manager"
- Identify documented and undocumented "rest api todo list manager" capabilities
- For each capability, create a script or small program to demonstrate the capability
- Exercise each capability identified with data typical to the intended use of the application

**Focus Areas (for 4-member team):**

- Todos
- Projects
- Categories
- Interoperability of these capabilities

**Session Requirements:**

- Timeboxed at 45 minutes per session
- Sessions can be done individually or in pairs
- All team members must participate

**Session Deliverables (PDF format):**

- Session notes
- Explicit references to scripts, programs, screenshots, video clips, spreadsheets, or any other files used/created
- Name of session participants
- All files created during the session
- Summary of session findings (bullet list answering "what we learned")
- List of concerns identified in session
- List of new testing ideas identified in session

#### 2. Unit Test Suite

Implement a comprehensive suite of unit tests using an open-source unit test tool (e.g., JUnit). All tests must:

- Be in the same suite using the same programming language and testing tool
- **Not** use automatically generated unit testing code
- Include at least one separate unit test module for each API identified in exploratory testing
- Include at least one unit test module for each documented API
- Include at least one unit test module for each undocumented API discovered

**Test Requirements:**

- Confirm the API does what it is supposed to do
- Identify bugs if actual behavior differs from documented behavior
- For APIs with different behavior than documentation: include two separate modules (one showing expected behavior failing, one showing actual behavior working)
- Confirm the API does not have unexpected side effects
- Confirm each API can generate payloads in JSON or XML
- Confirm return codes are correctly generated

**Unit Test Module Structure:**

- Ensure the system is ready to be tested
- Save the system state
- Set up the initial conditions for the test
- Execute the tests
- Assess correctness
- Restore the system to the initial state
- Run in any order
- Use clean, well-structured code following Bob Martin's Clean Code guidelines

**Additional Test Considerations:**

- Ensure unit tests fail if service is not running
- Include at least one test for malformed JSON payloads
- Include at least one test for malformed XML payloads
- For each API, include tests of invalid operations (e.g., deleting an already deleted object)

#### 3. Bug Summary

Define a form to collect bug information including:

- Executive summary of bug (80 characters or less)
- Description of bug
- Potential impact of bug on operation of system
- Steps to reproduce the bug

#### 4. Unit Test Suite Video

- Show video of all unit tests running in the selected development environment
- Include demonstration of tests run in random order using pseudo-random number generation

#### 5. Written Report (PDF format)

Target size: 5-10 pages

- Summarizes deliverables
- Describes findings of exploratory testing
- Describes structure of unit test suite
- Describes source code repository
- Describes findings of unit test suite execution

---

## Part B: Story Testing of REST API

### Project Overview (Part B)

Part B builds on the same Todo Manager REST API used in Part A. The goal is to define user stories in Gherkin, implement them as an automated acceptance test suite with Cucumber.js, and document defects found during execution.

**Application (same as Part A):**

- Start the API: `java -jar runTodoManagerRestAPI-1.5.5.jar`
- API docs: http://localhost:4567/docs

### Part B Objectives

#### 1. Story Test Suite (Gherkin + Cucumber)

- Define **20 user stories** (5 per team member) as Gherkin feature files, each with at least:
  - **Normal flow:** primary success path
  - **Alternate flow:** secondary path
  - **Error flow:** invalid inputs, non-existent IDs, or invalid query parameters
- Use **Scenario Outlines** and **Examples** for data-driven scenarios
- Use a **Background** section per feature to set initial conditions (server running, baseline data)
- Implement **step definitions** as a reusable library (shared steps + story-specific steps)
- Tests must **run in any order** and **restore initial state** after each scenario (hooks)
- Tests must **fail clearly if the API is not running**

#### 2. Source Code

- Clean, well-structured step definition code (Bob Martin’s Clean Code guidelines)
- Centralised API wrapper and shared steps; story-specific step files per feature

#### 3. Bug Summaries

- For each new bug found during story test execution, write a bug summary (PDF) with story reference, steps to reproduce, and impact

#### 4. Videos

- Video of all story tests running (at least two different orders, e.g. default and random)
- Video showing story tests failing when the API is not running

#### 5. Written Report (PDF, 5–10 pages)

- Summary of deliverables
- Structure of the story test suite
- Description of the source code repository
- Findings of story test suite execution (including bug summary)

---

## Repository Organization

The repository is organized to meet Part A and Part B requirements:

```
ECSE429/
├── README.md
├── partA/
│   ├── exploratory-testing/
│   ├── scripts/
│   ├── unit-tests/
│   ├── bugs/
│   └── documentation/
└── partB/
    ├── story_test_suite/           # Cucumber feature files and step definitions
    │   ├── features/               # Gherkin .feature files (Story1–Story20)
    │   ├── step_definitions/       # api.js, sharedSteps.js, hooks.js, Story*Steps.js
    │   └── package.json            # npm test, npm run test:random
    ├── bug_summaries/              # Bug report PDFs (Story/API defects)
    ├── reports/                    # Generated reports (e.g. cucumber-report.html)
    └── report_ecse_429_part_B*.pdf # Part B written report
```

### Directory Requirements Mapping

- **`exploratory-testing/`**:

  - **Requirement**: Exploratory Testing Session Deliverables (Section 1)
  - Contains PDF session notes with participant information, session findings, concerns, and new testing ideas
  - Includes all files created during exploratory testing sessions (screenshots, videos, spreadsheets, etc.)
- **`scripts/`**:

  - **Requirement**: Scripts/programs demonstrating API capabilities (Section 1 - "For each capability, create a script or small program to demonstrate the capability")
  - Contains shell scripts with curl commands demonstrating todos, projects, and categories capabilities in both JSON and XML formats
  - Addresses requirement to "Exercise each capability identified with data typical to the intended use of the application"
- **`unit-tests/`**:

  - **Requirement**: Unit Test Suite (Section 2)
  - Contains comprehensive unit test suite covering all documented and undocumented APIs
  - Tests confirm APIs work correctly, identify bugs, test JSON/XML payloads, verify return codes, test invalid operations, and ensure tests fail if service is not running
  - Includes separate modules for expected (failing) vs actual (working) behavior when API behavior differs from documentation
- **`bugs/`**:

  - **Requirement**: Bug Summary (Section 3)
  - Contains bug tracking form/template with executive summary, description, potential impact, and steps to reproduce
- **`documentation/`**:

  - **Requirement**: Unit Test Suite Video (Section 4) and Written Report (Section 5)
  - Contains video demonstrating all unit tests running, including random order execution
  - Contains 5-10 page PDF report summarizing deliverables, exploratory testing findings, unit test suite structure, repository description, and unit test execution findings

### Part B Directory Mapping

- **`partB/story_test_suite/`**:
  - **Requirement**: Story tests in Gherkin, step definitions as a library (Part B Section 1–2)
  - **`features/`**: 20 Gherkin feature files (Story1CreateTodo.feature through Story20…), each with Normal, Alternate, and Error flows and Background
  - **`step_definitions/`**: `api.js` (HTTP helpers), `sharedSteps.js` (reusable steps), `hooks.js` (Before/After, state cleanup), and `Story*Steps.js` per story
  - Run: from `partB/story_test_suite/`, `npm install` then `npm test` or `npm run test:random` (API must be running)
- **`partB/bug_summaries/`**:
  - **Requirement**: Bug summaries (Part B Section 3)
  - PDF bug reports for defects found during story test execution, with story reference and steps to reproduce
- **`partB/reports/`**:
  - Generated artifacts (e.g. Cucumber HTML report) when using the HTML formatter
- **`partB/` (root)**:
  - Part B written report PDF and any Part B videos (deliverables Section 4–5)

---

## Notes

- All exploratory testing sessions should be timeboxed at 45 minutes
- Unit tests must be able to run in any order
- Unit tests must clean up after themselves (restore system state)
- All deliverables should be in PDF format unless otherwise specified
- **Part B:** Story tests must run in any order, restore initial state after each scenario, and fail if the API is not running
