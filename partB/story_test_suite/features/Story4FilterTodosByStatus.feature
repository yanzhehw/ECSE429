Feature: Filter TODOs by completion status

    As a student, I filter TODOs by completion status so I can focus on what is left to do.

    Background: Server is running and TODOs exist
        Given the server is running
        And TODOs with the following details exist
            | title             | doneStatus | description         |
            | Write lab report  | false      | Due next week       |
            | Submit assignment | true       | Already submitted   |
            | Clean room        | false      | Weekend task        |

    Scenario Outline: View all incomplete TODOs (Normal Flow)
        When the student requests all TODOs with doneStatus "<status>"
        Then the response contains only TODOs with doneStatus "<status>"
        And the student is notified of the completion of the query operation

        Examples:
            | status |
            | false  |

    Scenario Outline: View all completed TODOs (Alternate Flow)
        When the student requests all TODOs with doneStatus "<status>"
        Then the response contains only TODOs with doneStatus "<status>"
        And the student is notified of the completion of the query operation

        Examples:
            | status |
            | true   |

    Scenario Outline: Filter TODOs with invalid doneStatus value (Error Flow / BUG)
        When the student requests all TODOs with invalid doneStatus "maybe"
        And the student is notified of the completion of the query operation

        Examples:
            | status |
            | maybe  |
