Feature: Remove a Task from a Project Todo List

    As a student, I remove a task from a project todo list, so I can reorganize my work when priorities change.

    Background: Server is running, TODOs and projects exist and are associated
        Given the server is running
        And TODOs with the following details exist
            | title                       | doneStatus | description            |
            | Implement REST endpoints    | false      | part A of the project  |
            | Write unit tests            | false      | at least 252 tests     |
            | Submit lab report           | false      | include all graphs     |
        And course todo list projects with the following details exist
            | title    | completed | description        | active |
            | ECSE 429 | false     | Software Testing   | true   |
            | ECSE 420 | false     | Parallel Computing | true   |
        And TODOs with titles associated with courses
            | title                     | course   |
            | Implement REST endpoints  | ECSE 429 |
            | Write unit tests          | ECSE 429 |
            | Submit lab report         | ECSE 420 |

    Scenario Outline: Remove an associated task from a project todo list (Normal Flow)
        When a student removes a TODO with title "<title>" from a course todo list with name "<project>"
        Then the TODO with title "<title>" is removed from the course todo list with name "<project>"
        And the student is notified of the completion of the deletion operation

    Examples:
        | title              | project  |
        | Write unit tests   | ECSE 429 |
        | Submit lab report  | ECSE 420 |

    Scenario Outline: Remove a task after marking it as done (Alternate Flow)
        Given the student assigns a doneStatus "<doneStatus>" to a TODO with title "<title>"
        When a student removes a TODO with title "<title>" from a course todo list with name "<project>"
        Then the TODO with title "<title>" is removed from the course todo list with name "<project>"
        And the student is notified of the completion of the deletion operation

    Examples:
        | title              | doneStatus | project  |
        | Submit lab report  | true       | ECSE 420 |

    Scenario Outline: Remove a task not associated with the given project (Error Flow)
        Given a TODO with title "<title>" is not associated with the course todo list with name "<project>"
        When a student removes a TODO with title "<title>" from a course todo list with name "<project>"
        Then the student is notified of the non-existence error with a message "<message>"

    Examples:
        | title              | project  | message                                       |
        | Submit lab report  | ECSE 429 | Could not find any instances with projects    |
