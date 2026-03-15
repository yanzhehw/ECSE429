Feature: Assign a project to a category

    As a student, I assign a category to a project, so I can organize my projects in the system

    Background: Server is running and projects exist in various states
        Given the server is running
        And categories with the following details exist
            | id       | title        | description           |
            | 1        | ECSE 429     | Software Testing      |
            | 2        | ESCE 420     | Parallel Computing    |
            | 3        | ECSE 444     | Microprocessors       |
        And course todo list projects with the following details exist
            | title     | completed | description        | active |
            | project 1 | false     | testing an API     | true   |

    Scenario Outline: Add an existing category to an existing project (Normal Flow)
        When a student adds a category with title "<category>" to a project with title "<project>"
        Then the project with title "<project>" can see the category with title "<category>"
        And the student is notified of the completion of the creation operation

    Examples:
        | title     | completed | description        | active | category   |
        | project 1 | false     | Software Testing   | true   | ECSE 429   |


    Scenario Outline: Create a new category and immediately add it to a project (Alternate Flow)
        Given the student creates a category with title "<category>" and description "<description>"
        When a student adds a category with title "<category>" to a project with title "<project>"
        Then the student is notified of the completion of the creation operation

    Examples:
        | title      | completed | description        | active | category   |
        | project 1  | false     | testing an API     | true   | ECSE 429   |

    Scenario Outline: Add a category to a non-existing project (Error Flow)
        Given a project with title "<title>" does not exist
        When a student adds a category with title "<category>" to a project with title "<project>"
        Then the student is notified of the non-existence error with a message "<message>"

    Examples:
        | title     | completed | description        | active | category   | message                                                         |
        | project2  | false      | Software Testing  | true   | ECSE 429   | Could not find parent relationship categories/project2/projects |
