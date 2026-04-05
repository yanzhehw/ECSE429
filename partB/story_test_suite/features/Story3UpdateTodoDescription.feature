Feature: Update a TODO description

    As a student, I update the description of a TODO so I can refine the details of the task.

    Background: Server is running and TODOs exist
        Given the server is running
        And TODOs with the following details exist
            | title             | doneStatus | description          |
            | Read textbook     | false      | Chapter 1            |
            | Prepare slides    | false      | Draft outline        |

    Scenario Outline: Update the description of a TODO (Normal Flow)
        When the student updates the TODO with title "<title>" to have description "<newDescription>"
        Then the TODO with title "<title>" exists with description "<newDescription>" and doneStatus "<doneStatus>"
        And the student is notified of the completion of the update operation

        Examples:
            | title          | newDescription   | doneStatus |
            | Read textbook  | Chapters 1 and 2 | false      |

    Scenario Outline: Update both title and description of a TODO (Alternate Flow)
        When the student renames the TODO from title "<oldTitle>" to new title "<newTitle>" and description "<newDescription>"
        Then the TODO with title "<newTitle>" exists with description "<newDescription>" and doneStatus "false"
        And the student is notified of the completion of the update operation

        Examples:
            | oldTitle       | newTitle               | newDescription        |
            | Prepare slides | Prepare final slides   | Finalize all slides   |

    Scenario Outline: Update a TODO with invalid data (Error Flow / BUG)
        When the student attempts to update the TODO with title "<title>" to have invalid payload
        Then the student is notified of the failed validation with a message "Failed Validation"

        Examples:
            | title          |
            | Read textbook  |
