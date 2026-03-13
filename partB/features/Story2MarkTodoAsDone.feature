Feature: Mark a TODO as done

    As a student, I mark TODOs as done so I can see which tasks are completed.

    Background: Server is running and TODOs exist
        Given the server is running
        And TODOs with the following details exist
            | title              | doneStatus | description        |
            | Finish assignment  | false      | Write report draft |
            | Wash dishes        | false      | Kitchen sink       |

    Scenario Outline: Mark a TODO as done (Normal Flow)
        When the student marks the TODO with title "<title>" as done
        Then the TODO with title "<title>" has doneStatus "true"
        And the student is notified of the completion of the update operation

        Examples:
            | title             |
            | Finish assignment |
            | Wash dishes       |

    Scenario Outline: Toggle a TODO back to not done (Alternate Flow)
        When the student marks the TODO with title "<title>" as done
        And the student marks the TODO with title "<title>" as not done
        Then the TODO with title "<title>" has doneStatus "false"
        And the student is notified of the completion of the update operation

        Examples:
            | title             |
            | Finish assignment |

    Scenario Outline: Mark a non-existing TODO as done (Error Flow)
        When the student attempts to mark the TODO with id "<todoId>" as done
        Then the student is notified of the non-existence error with a message "<message>"

        Examples:
            | todoId | message                                       |
            | 99999  | No such todo entity instance with GUID or ID  |
