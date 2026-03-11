Feature: Create a New Project

    As a student, I create a to do list for a new project I am working on, so I can manage my tasks.

    Background: Server is running
        Given the server is running

    Scenario Outline: Create a project with a title, description, and active status (Normal Flow)
        When a student creates a new course todo list with <title>, <completed>, <description>, and <active>
        Then the course todo list is created with <title>, <completed>, <description>, and <active>
        And the student is notified of the completion of the creation operation

    Examples:
        | title      | completed | description          | active  |
        | "ECSE 429" | "false"   | "Software Testing"   | "true"  |
        | "ECSE 420" | "false"   | "Parallel Computing" | "true"  |

    Scenario Outline: Create a project with only a title and no description (Alternate Flow)
        When a student creates a new course todo list with <title>, <completed>, and <active>
        Then the course todo list is created with <title>, <completed>, and <active>
        And the student is notified of the completion of the creation operation

    Examples:
        | title      | completed | active  |
        | "ECSE 429" | "false"   | "true"  |
        | "ECSE 420" | "false"   | "false" |

    Scenario Outline: Create a project with an invalid value for the completed field (Error Flow)
        When a student creates a new course todo list with <title>, <description>, and wrong <bad_completed>
        Then the student is notified of the failed validation with a message <message>

    Examples:
        | title      | description        | bad_completed | message                                          |
        | "ECSE 429" | "Software Testing" | "done"        | "Failed Validation: completed should be BOOLEAN" |
