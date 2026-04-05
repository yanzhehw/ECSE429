Feature: Add a Category to a Todo

    As a student, I add a category to a todo item so I can organize my tasks by subject area.

    Background: Server is running, TODOs and categories exist
        Given the server is running
        And TODOs with the following details exist
            | title                       | doneStatus | description              |
            | Implement REST endpoints    | false      | part A of the project    |
            | Write unit tests            | false      | at least 252 tests       |
            | Submit lab report           | false      | include all graphs       |
        And categories with the following details exist
            | title       | description               |
            | Urgent      | high priority tasks       |
            | School      | academic coursework       |

    Scenario Outline: Add an existing category to an existing todo (Normal Flow)
        When a student adds a category with title "<category>" to a TODO with title "<title>"
        Then the TODO with title "<title>" can see the category with title "<category>"
        And the category with title "<category>" cannot see the TODO with title "<title>"
        And the student is notified of the completion of the creation operation

    Examples:
        | title                    | category |
        | Write unit tests         | School   |
        | Submit lab report        | Urgent   |

    Scenario Outline: Create a new category and immediately add it to a todo (Alternate Flow)
        Given the student creates a category with title "<category>" and description "<description>"
        When a student adds a category with title "<category>" to a TODO with title "<title>"
        Then the TODO with title "<title>" can see the category with title "<category>"
        And the category with title "<category>" cannot see the TODO with title "<title>"
        And the student is notified of the completion of the creation operation

    Examples:
        | title                     | category   | description              |
        | Implement REST endpoints  | Assignment | project deliverable      |

    Scenario Outline: Add a category to a non-existing todo (Error Flow)
        Given a TODO with id "<todo_id>" does not exist
        When a student adds a category with title "<category>" to a TODO with id "<todo_id>"
        Then the student is notified of the non-existence error with a message "<message>"

    Examples:
        | todo_id | category | message                                                          |
        | 99999   | School   | Could not find parent thing for relationship todos/99999/categories |
