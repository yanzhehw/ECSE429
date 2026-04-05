Feature: Update a category description

    As a student, I update the description of a category so I can refine the details of the category.

    Background: Server is running and TODOs exist
        Given the server is running
        And categories with the following details exist
            | id    | title         | description        |
            | 1     | Math          | todos for Math 223 |
            | 2     | Physics       | todos for Phys 101 |

    Scenario Outline: Update the description of a category (Normal Flow)
        When the student updates the category with title "<title>" to have description "<newDescription>"
        Then the category with title "<title>" exists with description "<newDescription>"
        And the student is notified of the completion of the update operation

        Examples:
            | id    | title         | newDescription                  |
            | 1     | Math          | todos for Math 223 and Math 271 |
            | 2     | Physics       | todos for Phys 101              |

    Scenario Outline: Update both title and description of a category (Alternate Flow)
        When the student renames the category from title "<oldTitle>" to new title "<newTitle>" and description "<newDescription>"
        Then the category with title "<newTitle>" exists with description "<newDescription>"
        And the student is notified of the completion of the update operation

        Examples:
            | id    | oldTitle | newTitle          | newDescription                  |
            | 1     | Math     | Math and Stats    | todos for Math 223 and ECSE 205 |
            | 2     | Physics  | Physics           | todos for Phys 101              |

    Scenario Outline: Update a category with invalid title (Error Flow)
        When the student attempts to update the category with invalid title "<title>"
        Then the student is notified of the non-existence error with a message "<message>"


        Examples:
            | title         | message                                                             |
            | badTitle      | No such category entity instance with GUID or ID invalid-id found   |
