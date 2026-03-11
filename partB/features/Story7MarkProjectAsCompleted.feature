Feature: Mark a Project as Completed

    As a student, I mark a project as completed and inactive, so I can distinguish finished work from ongoing tasks.

    Background: Server is running and projects exist
        Given the server is running
        And course todo list projects with the following details exist
            | title    | completed | description          | active |
            | ECSE 429 | false     | Software Testing     | true   |
            | ECSE 420 | false     | Parallel Computing   | true   |

    Scenario Outline: Mark a project as completed and inactive (Normal Flow)
        Given student is registered in the class with title <title>
        When the student requests to mark the project with title <title> as completed and inactive
        Then the project with title <title> has completed set to "true" and active set to "false"
        And the student is notified of the completion of the update operation

    Examples:
        | title      |
        | "ECSE 429" |
        | "ECSE 420" |

    Scenario Outline: Mark a project as completed without updating active status (Alternate Flow)
        Given student is registered in the class with title <title>
        When the student requests to mark the project with title <title> as completed only
        Then the project with title <title> has completed set to "true" and active set to "true"
        And the student is notified of the completion of the update operation

    Examples:
        | title      |
        | "ECSE 429" |
        | "ECSE 420" |

    Scenario Outline: Mark a non-existing project as completed (Error Flow)
        Given a project with id <project_id> does not exist
        When the student requests to mark the project with id <project_id> as completed and inactive
        Then the student is notified of the non-existence error with a message <message>

    Examples:
        | project_id | message                                                    |
        | "33"       | "No such project entity instance with GUID or ID 33 found" |
