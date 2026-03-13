Feature: Remove a Category from a Todo

    As a student, I remove a category from a todo item so I can re-organize my tasks when priorities change.

    Background: Server is running, TODOs and categories exist and are associated
        Given the server is running
        And TODOs with the following details exist
            | title                       | doneStatus | description              |
            | Implement REST endpoints    | false      | part A of the project    |
            | Write unit tests            | false      | at least 252 tests       |
            | Submit lab report           | false      | include all graphs       |
        And categories with the following details exist
            | title  | description         |
            | Urgent | high priority tasks |
            | School | academic coursework |
        And TODOs with titles associated with categories
            | title                     | category |
            | Implement REST endpoints  | School   |
            | Write unit tests          | School   |
            | Submit lab report         | Urgent   |

    Scenario Outline: Remove an associated category from an existing todo (Normal Flow)
        When a student removes the category with title "<category>" from a TODO with title "<title>"
        Then the TODO with title "<title>" can no longer see the category with title "<category>"
        And the student is notified of the completion of the deletion operation

    Examples:
        | title              | category |
        | Write unit tests   | School   |
        | Submit lab report  | Urgent   |

    Scenario Outline: Remove a category after marking the todo as done (Alternate Flow)
        Given the student assigns a doneStatus "<doneStatus>" to a TODO with title "<title>"
        When a student removes the category with title "<category>" from a TODO with title "<title>"
        Then the TODO with title "<title>" can no longer see the category with title "<category>"
        And the student is notified of the completion of the deletion operation

    Examples:
        | title              | doneStatus | category |
        | Submit lab report  | true       | Urgent   |

    Scenario Outline: Remove a category not associated with the given todo (Error Flow)
        Given a TODO with title "<title>" is not associated with the category with title "<category>"
        When a student removes the category with title "<category>" from a TODO with title "<title>"
        Then the student is notified of the non-existence error with a message "<message>"

    Examples:
        | title              | category | message                                    |
        | Submit lab report  | School   | Could not find any instances with todos    |
