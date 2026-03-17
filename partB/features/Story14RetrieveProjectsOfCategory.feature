Feature: Retrieve all projects of a specific category

    As a student, I retrieve all the projects assign to one category to view my workload

    Background: Server is running, TODOs and projects exist
        Given the server is running
        And categories with the following details exist
            | id     | title        | description           |
            | 1      | ECSE 429     | Software Testing      |
            | 2      | ESCE 420     | Parallel Computing    |
            | 3      | ECSE 444     | Microprocessors       |
        And course todo list projects with the following details exist
            | title     | completed | description          | active | category |
            | project 1 | false     | memory task          | true   | ECSE 444 |
            | project 2 | false     | Bluetooth connection | true   | ECSE 444 |
            | project 3 | false     | inputs and outputs   | true   | None     |
            | lab 1     | false     | mutexes and locks    | true   | ECSE 420 |

    Scenario Outline: Retrieve all active projects assigned to a category (Normal Flow)
        When the student retrieves all projects with active set to "<active>" and assigned to category with title "<category>"
        Then the system returns only projects where active is "<active>"
        And the student is notified of the completion of the query operation

    Examples:
        | active | category |
        | true   | ECSE 444 |
        | true   | ECSE 420 |

    Scenario Outline: Assign a category to an existing project and retrieve all projects assigned to this category (Alternate Flow)
        Given the student creates a relationship between a category with title "<category>" and a project with title "<project>"
        When the student retrieves all projects assigned to category with title "<category>"
        Then the category with title "<category>" is added as a task of the course todo list with name "<title>"
        And the student is notified of the completion of the creation operation

    Examples:
        | title     | category |
        | project 3 | ECSE 444 |

    Scenario Outline: Retrieve all projects assigned to a non-existing category (Error Flow)
        Given a category with title "<category>" does not exist
        When a student adds a category with title "<category>" to a project with title "<title>"
        Then the student is notified of the non-existence error with a message "<message>"

    Examples:        
        | title     | category      | message                                                                     |
        | project 2 | fake category | Could not find thing matching value for id |