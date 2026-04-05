Feature: Delete a Project Connected to a Todo

    As a student, I delete a project that has associated todos, expecting the todos to remain intact after the project is removed.

    Background: Server is running, TODOs and projects exist and are associated
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
        And TODOs with titles associated with courses
            | title                     | course   |
            | Implement REST endpoints  | ECSE 429 |
            | Write unit tests          | ECSE 429 |
            | Submit lab report         | ECSE 420 |

    Scenario Outline: Delete a project and verify its associated todos are not deleted (Normal Flow)
        When the student deletes the course todo list with name "<project>"
        Then the course todo list with name "<project>" no longer exists
        And the TODO with title "<title>" still exists
        And the student is notified of the completion of the deletion operation

    Examples:
        | project  | title            |
        | ECSE 429 | Write unit tests |

    Scenario Outline: Delete one of multiple projects and verify the todo still belongs to the remaining project (Alternate Flow)
        When the student deletes the course todo list with name "<deleted_project>"
        Then the course todo list with name "<deleted_project>" no longer exists
        And the TODO with title "<title>" still exists
        And the TODO with title "<title>" is still a task of the course todo list with name "<remaining_project>"
        And the student is notified of the completion of the deletion operation

    Examples:
        | deleted_project | remaining_project | title                     |
        | ECSE 420        | ECSE 429          | Implement REST endpoints  |

    Scenario Outline: Delete a non-existing project (Error Flow)
        Given a project with id "<project_id>" does not exist
        When the student attempts to delete the course todo list with id "<project_id>"
        Then the student is notified of the non-existence error with a message "<message>"

    Examples:
        | project_id | message                           |
        | 99999      | Could not find any instances with |
