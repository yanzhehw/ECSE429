Feature: Deletion of a category

    As a student, I delete a category from my todo manager to clean it up.

    Background: Server is running and categories exist
        Given the server is running
        And categories with the following details exist
            | id    | title         | description        |
            | 1     | course 1      | todos for course 1 |
            | 2     | course 2      | todos for course 2 |
            | 3     | course 3      | todos for course 3 |

    Scenario Outline: Remove a category from the todo manager (Normal Flow)
        When a student removes a category with title "<title>" 
        Then the category with title "<title>" is removed from the categories in the todo manager
        And the student is notified of the completion of the deletion operation

    Examples:
        | id    | title         | description        |
        | 1     | course 1      | todos for course 1 |
        | 2     | course 2      | todos for course 2 |
        

    Scenario Outline: Delete category after updating description (Alternate Flow)
        Given the student assigns new description "<description>" to a category with title "<title>"
        When a student removes a category with title "<title>" from the categories in the todo manager
        Then the category with title "<title>" is removed from the categories in the todo manager
        And the student is notified of the completion of the deletion operation

        Examples:
        | id    | title         | description        |
        | 1     | course 1      | todos for course 1 |

    Scenario Outline: Delete a non-existing category (Error Flow)
        When the student attempts to delete the category with title "<title>"
        Then the student is notified of the non-existence error with a message "<message>"

        Examples:
            | title    | message                                          |
            | hello    | Could not find any category with title "hello"   |