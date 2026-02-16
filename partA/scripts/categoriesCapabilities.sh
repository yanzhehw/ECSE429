echo "GET all categories"

curl --location --request GET 'http://localhost:4567/categories'

echo $'\n*************************************************************************************************************'


echo "HEAD request for all categories ('/categories')"

curl --location --head 'http://localhost:4567/categories'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create a new category with title and description"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "University",
    "description": "Category for University related stuff!"
}'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create category with only title (minimal fields)"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Minimal Category"
}'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Attempt to create category with an id in the request body (should fail)"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 10,
    "title": "Invalid Category"
}'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create category with empty body"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Content-Type: application/json' \
--data-raw '{}'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create category with invalid field"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Test",
    "invalidField": "value"
}'

echo $'\n*************************************************************************************************************'


echo "DELETE request to /categories endpoint without specifying category id (should fail - 405)"

curl --location --request DELETE 'http://localhost:4567/categories'

echo $'\n*************************************************************************************************************'


echo "PUT request on /categories without id (should fail - 405)"

curl --location --request PUT 'http://localhost:4567/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Test"
}'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id ENDPOINT
# =====================================================

echo "GET category with id=1"

curl --location --request GET 'http://localhost:4567/categories/1'

echo $'\n*************************************************************************************************************'


echo "GET category with non-existing id=20"

curl --location --request GET 'http://localhost:4567/categories/20'

echo $'\n*************************************************************************************************************'


echo "HEAD request for category with existing id=1"

curl --location --head 'http://localhost:4567/categories/1'

echo $'\n*************************************************************************************************************'


echo "HEAD request for category with non-existing id=20"

curl --location --head 'http://localhost:4567/categories/20'

echo $'\n*************************************************************************************************************'


echo "Update existing category using POST request to /categories/:id endpoint (amend)"

curl --location --request POST 'http://localhost:4567/categories/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "College",
    "description": "Updated description"
}'

echo $'\n*************************************************************************************************************'


echo "POST to non-existing category id (should fail)"

curl --location --request POST 'http://localhost:4567/categories/999' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Ghost Category"
}'

echo $'\n*************************************************************************************************************'


echo "Update existing category using PUT request to /categories/:id endpoint (replace)"

curl --location --request PUT 'http://localhost:4567/categories/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "University",
    "description": "Replaced description"
}'

echo $'\n*************************************************************************************************************'


echo "PUT with partial fields on /categories/:id (check if other fields are erased)"

curl --location --request PUT 'http://localhost:4567/categories/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Partial Update Only"
}'

echo $'\n*************************************************************************************************************'


echo "PUT to non-existing category id (should fail)"

curl --location --request PUT 'http://localhost:4567/categories/999' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Ghost"
}'

echo $'\n*************************************************************************************************************'


echo "DELETE existing category"

# First create a category to delete
curl --location --request POST 'http://localhost:4567/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "To Be Deleted",
    "description": "This category will be deleted"
}'
echo ""
echo "Now deleting the created category..."

curl --location --request DELETE 'http://localhost:4567/categories/3'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing category (should fail - 404)"

curl --location --request DELETE 'http://localhost:4567/categories/999'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/projects ENDPOINT (category-project relationship)
# =====================================================

echo "POST /categories/:id/projects : Create category-project relationship (add project id=1 to category id=1)"

curl --location --request POST 'http://localhost:4567/categories/1/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/projects : Create relationship with non-existing project id (should fail)"

curl --location --request POST 'http://localhost:4567/categories/1/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/projects : Create relationship for non-existing category (should fail)"

curl --location --request POST 'http://localhost:4567/categories/999/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/projects : Get all projects related to category id=1"

curl --location --request GET 'http://localhost:4567/categories/1/projects'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/projects : Get projects for non-existing category id=20"

curl --location --request GET 'http://localhost:4567/categories/20/projects'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing category-project relationship"

curl --location --head 'http://localhost:4567/categories/1/projects'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing category-project relationship"

curl --location --head 'http://localhost:4567/categories/20/projects'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/projects/:id ENDPOINT
# =====================================================

echo "DELETE existing category-project relationship"

curl --location --request DELETE 'http://localhost:4567/categories/1/projects/1'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /categories/:id/projects after deleting relationship"

curl --location --request GET 'http://localhost:4567/categories/1/projects'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing category-project relationship (should fail)"

curl --location --request DELETE 'http://localhost:4567/categories/20/projects/1'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/todos ENDPOINT (category-todo relationship)
# =====================================================

echo "POST /categories/:id/todos : Create category-todo relationship (add todo id=1 to category id=1)"

curl --location --request POST 'http://localhost:4567/categories/1/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/todos : Create another category-todo relationship (add todo id=2 to category id=1)"

curl --location --request POST 'http://localhost:4567/categories/1/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/todos : Create relationship with non-existing todo id (should fail)"

curl --location --request POST 'http://localhost:4567/categories/1/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/todos : Create relationship for non-existing category (should fail)"

curl --location --request POST 'http://localhost:4567/categories/999/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/todos : Get all todos related to category id=1"

curl --location --request GET 'http://localhost:4567/categories/1/todos'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/todos : Get todos for non-existing category id=20"

curl --location --request GET 'http://localhost:4567/categories/20/todos'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing category-todo relationship"

curl --location --head 'http://localhost:4567/categories/1/todos'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing category-todo relationship"

curl --location --head 'http://localhost:4567/categories/20/todos'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/todos/:id ENDPOINT
# =====================================================

echo "DELETE existing category-todo relationship"

curl --location --request DELETE 'http://localhost:4567/categories/1/todos/2'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /categories/:id/todos after deleting relationship"

curl --location --request GET 'http://localhost:4567/categories/1/todos'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing category-todo relationship (should fail)"

curl --location --request DELETE 'http://localhost:4567/categories/20/todos/1'

echo $'\n*************************************************************************************************************'


echo "DONE: All categories capability tests completed"