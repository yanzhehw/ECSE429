Feature: Retrieve All Projects a Todo Belongs To

    As a student, I retrieve all projects associated with a todo so I can see which course lists contain that task.

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

    Scenario Outline: Retrieve all projects for a todo with an associated project (Normal Flow)
        When a student retrieves all projects for the TODO with title "<title>"
        Then the response contains the project with name "<project>"
        And the project with name "<project>" can see the TODO with title "<title>"

    Examples:
        | title                    | project  |
        | Write unit tests         | ECSE 429 |
        | Submit lab report        | ECSE 420 |

    Scenario Outline: Retrieve all projects for a todo that belongs to multiple projects (Alternate Flow)
        Given the TODO with title "<title>" is also added to the course todo list with name "<second_project>"
        When a student retrieves all projects for the TODO with title "<title>"
        Then the response contains the project with name "<first_project>"
        And the response contains the project with name "<second_project>"

    Examples:
        | title                     | first_project | second_project |
        | Implement REST endpoints  | ECSE 429      | ECSE 420       |

    Scenario Outline: Retrieve all projects for a non-existing todo (Error Flow)
        Given a TODO with id "<todo_id>" does not exist
        When a student retrieves all projects for the TODO with id "<todo_id>"
        Then the student is notified of the non-existence error with a message "<message>"

    Examples:
        | todo_id | message                                                            |
        | 99999   | Could not find parent thing for relationship todos/99999/tasksof  |
