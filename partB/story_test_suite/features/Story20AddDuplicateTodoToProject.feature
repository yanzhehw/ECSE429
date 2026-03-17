Feature: Prevent Duplicate Todo-Project Relationship

    As a student, I expect that adding the same todo to a project a second time is accepted but does not create duplicate entries, and that relationships created via the project endpoint are not visible from the todo's tasksof endpoint.

    Background: Server is running, TODOs and projects exist
        Given the server is running
        And TODOs with the following details exist
            | title                       | doneStatus | description              |
            | Implement REST endpoints    | false      | part A of the project    |
            | Write unit tests            | false      | at least 252 tests       |
            | Submit lab report           | false      | include all graphs       |
        And course todo list projects with the following details exist
            | title    | completed | description          | active |
            | ECSE 429 | false     | Software Testing     | true   |
            | ECSE 420 | false     | Parallel Computing   | true   |

    Scenario Outline: Add a todo to a project once (Normal Flow)
        When a student adds a TODO with title "<title>" to a course todo list with name "<project>"
        Then the TODO with title "<title>" is added as a task of the course todo list with name "<project>"
        And the project with name "<project>" contains exactly one task with title "<title>"
        And the student is notified of the completion of the creation operation

    Examples:
        | title              | project  |
        | Write unit tests   | ECSE 429 |
        | Submit lab report  | ECSE 420 |


    Scenario Outline: Add a todo to a project a second time via the project's tasks endpoint (Alternate Flow)
        Given the TODO with title "<title>" is already a task of the course todo list with name "<project>"
        # Adding the same relationship a second time
        When a student adds a TODO with title "<title>" to a course todo list with name "<project>" via the project tasks endpoint
        Then the student is notified of the completion of the creation operation
        And the project with name "<project>" still contains exactly one task with title "<title>"

    Examples:
        | title            | project  |
        | Write unit tests | ECSE 429 |

    Scenario Outline: Add todo to project via project endpoint and verify the project is not visible from the todo's tasksof (Error Flow)
        When a student adds a TODO with title "<title>" to a course todo list with name "<project>" via the project tasks endpoint
        Then the student is notified of the completion of the creation operation
        # The project should not be visible from the todo's tasksof endpoint, As relationships  
        # created via the project endpoint should not be visible from the todo's tasksof endpoint
        And the project with name "<project>" is not visible from the TODO with title "<title>"

    Examples:
        | title              | project  |
        | Submit lab report  | ECSE 420 |
