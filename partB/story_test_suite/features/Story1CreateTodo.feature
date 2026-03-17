Feature: Create a new TODO

    As a student, I create new TODO items so I can track tasks I need to complete.

    Background: Server is running
        Given the server is running

    Scenario Outline: Create a TODO with title, description, and doneStatus (Normal Flow)
        When the student creates a TODO with title "<title>", description "<description>", and doneStatus "<doneStatus>"
        Then the TODO with title "<title>" exists with description "<description>" and doneStatus "<doneStatus>"
        And the student is notified of the completion of the creation operation

        Examples:
            | title                    | description         | doneStatus |
            | Finish webwork           | 3 problems left     | false      |
            | Do Shakespeare reading   | Act 1 only          | false      |

    Scenario Outline: Create a TODO with only a title (Alternate Flow)
        When the student creates a TODO with only title "<title>"
        Then the TODO with title "<title>" exists with description "" and doneStatus "false"
        And the student is notified of the completion of the creation operation

        Examples:
            | title         |
            | Buy groceries |
            | Call parents  |

    Scenario Outline: Create a TODO with invalid data (Error Flow)
        When the student attempts to create a TODO with invalid payload having doneStatus "<badDoneStatus>"
        Then the student is notified of the failed validation with a message "<message>"

        Examples:
            | badDoneStatus | message                                           |
            | maybe         | Failed Validation: doneStatus should be BOOLEAN   |
