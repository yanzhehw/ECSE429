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

## Repository Organization

The repository is organized to meet all Part A requirements:

```
ECSE429/
├── README.md
└── partA/
    ├── exploratory-testing/
    ├── scripts/
    ├── unit-tests/
    ├── bugs/
    └── documentation/
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

---

## Notes

- All exploratory testing sessions should be timeboxed at 45 minutes
- Unit tests must be able to run in any order
- Unit tests must clean up after themselves (restore system state)
- All deliverables should be in PDF format unless otherwise specified
