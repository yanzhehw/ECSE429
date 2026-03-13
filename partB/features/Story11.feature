Feature: Create a New Category

    As a student, I create a new category to sort my tasks and projects.

    Background: Server is running
        Given the server is running

    Scenario Outline: Create a category with an id, title, and description (Normal Flow)
        When a student creates a new category with <id>, <title>, and <description>
        Then the category is created with <id>, <title>, and <description>
        And the student is notified of the completion of the creation operation

    Examples:
        | id         | title            | description           |
        | "1"        | "urgent"         | "Has to be done ASAP" |
        | "20"       | "work related"   | "related to my job"   |

    Scenario Outline: Create a category with only a title and no description (Alternate Flow)
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
