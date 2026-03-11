Feature: Add a Task to a Project Todo List

    As a student, I add a task to a project todo list, so I can track all the work required for that project.

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

    Scenario Outline: Add an existing task to an existing project todo list (Normal Flow)
        When a student adds a TODO with title <title> to a course todo list with name <project>
        Then the TODO with title <title> is added as a task of the course todo list with name <project>
        And the student is notified of the completion of the creation operation

    Examples:
        | title                      | project    |
        | "Write unit tests"         | "ECSE 429" |
        | "Submit lab report"        | "ECSE 420" |

    Scenario Outline: Create a new task and immediately add it to a project todo list (Alternate Flow)
        Given the student creates a TODO with title <title> and description <description>
        When a student adds a TODO with title <title> to a course todo list with name <project>
        Then the TODO with title <title> is added as a task of the course todo list with name <project>
        And the student is notified of the completion of the creation operation

    Examples:
        | title                  | description           | project    |
        | "Review lecture notes" | "chapters 4 and 5"   | "ECSE 429" |

    Scenario Outline: Add a task to a non-existing project todo list (Error Flow)
        Given a project with id <project_id> does not exist
        When a student adds a TODO with title <title> to a course todo list with id <project_id>
        Then the student is notified of the non-existence error with a message <message>

    Examples:
        | title               | project_id | message                                                          |
        | "Write unit tests"  | "33"       | "Could not find parent thing for relationship projects/33/tasks" |
