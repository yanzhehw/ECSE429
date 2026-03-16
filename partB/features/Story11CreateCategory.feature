Feature: Create a new category

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

    Scenario Outline: Create a category with only an id and a title(Alternate Flow)
        When a student creates a new category with <id>, and <title>
        Then the category is created with <id>, and <title>
        And the student is notified of the completion of the creation operation

    Examples:
        | id  | title       |
        | "1" | "Class 1"   |
        | "2" | "Class 2"   |

    Scenario Outline: Create a category with a missing value for a manditory field (Error Flow)
        When a student creates a new course todo list with <id> and <description>
        Then the student is notified of the failed validation with a message <message>

    Examples:
        | id  | title      | description    | message                                          |
        | "2" | NONE       | "testing"      | "Failed Validation: category requires a title"   |
