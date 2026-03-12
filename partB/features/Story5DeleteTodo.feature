Feature: Delete a TODO

    As a student, I delete TODOs that are no longer needed so my list stays clean.

    Background: Server is running and TODOs exist
        Given the server is running
        And TODOs with the following details exist
            | title            | doneStatus | description        |
            | Old reminder     | false      | No longer relevant |
            | Completed task   | true       | Already finished   |

    Scenario Outline: Delete an existing TODO (Normal Flow)
        When the student deletes the TODO with title <title>
        Then the TODO with title <title> no longer exists
        And the student is notified of the completion of the deletion operation

        Examples:
            | title          |
            | "Old reminder" |

    Scenario Outline: Delete multiple TODOs sequentially (Alternate Flow)
        When the student deletes the TODO with title <firstTitle>
        And the student deletes the TODO with title <secondTitle>
        Then the TODO with title <firstTitle> no longer exists
        And the TODO with title <secondTitle> no longer exists
        And the student is notified of the completion of the deletion operation

        Examples:
            | firstTitle      | secondTitle      |
            | "Old reminder"  | "Completed task" |

    Scenario Outline: Delete a non-existing TODO (Error Flow)
        When the student attempts to delete the TODO with id <todoId>
        Then the student is notified of the non-existence error with a message <message>

        Examples:
            | todoId | message                                |
            | "99999"| "Could not find any instances with"    |

