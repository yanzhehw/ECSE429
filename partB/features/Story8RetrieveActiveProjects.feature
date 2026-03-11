Feature: Query Active and Incomplete Projects

    As a student, I query all active and incomplete projects, so I can see what work is currently in progress.

    Background: Server is running and projects exist in various states
        Given the server is running
        And course todo list projects with the following details exist
            | title    | completed | description        | active |
            | ECSE 429 | false     | Software Testing   | true   |
            | ECSE 420 | false     | Parallel Computing | true   |
            | COMP 310 | true      | Operating Systems  | false  |

    Scenario Outline: Query only genuinely in-progress projects using both filters (Normal Flow)
        When the student requests to query all projects with active set to <active> and completed set to <completed>
        Then the system returns only projects where active is <active> and completed is <completed>
        And the student is notified of the completion of the query operation

    Examples:
        | active | completed |
        | "true" | "false"   |

    Scenario Outline: Query active projects without filtering on completed (Alternate Flow)
        Given a project with title <title> exists with active set to "true" and completed set to "true"
        When the student requests to query all projects with active set to "true"
        Then the system returns projects including ones where active is "true" and completed is "true"
        And the student is notified of the completion of the query operation

    Examples:
        | title      |
        | "ECSE 429" |

    Scenario Outline: Create a project with an invalid value for the active field (Error Flow)
        When the student requests to query all projects with invalid active value <bad_active>
        Then the student is notified of the failed validation with a message <message>

    Examples:
        | bad_active | message                                      |
        | "maybe"    | "Failed Validation: active should be BOOLEAN" |
