echo "GET all todos"

curl --location --request GET 'http://localhost:4567/todos'

echo $'\n*************************************************************************************************************'


echo "HEAD request for all todos ('/todos')"

curl --location --head 'http://localhost:4567/todos'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create a new todo with title, doneStatus, and description"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Wash Dishes",
    "doneStatus": false,
    "description": "Home Chore to be done"
}'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with only title (minimal fields)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Minimal Todo"
}'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Attempt to create todo with an id in the request body (should fail)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 10,
    "title": "Invalid Todo",
    "doneStatus": false
}'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with empty body"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{}'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with invalid field"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Test",
    "invalidField": "value"
}'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with invalid doneStatus type (should fail)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Bad Status",
    "doneStatus": "notABoolean"
}'

echo $'\n*************************************************************************************************************'


echo "Filter Todos: GET all todos with doneStatus=false"

curl --location --request GET 'http://localhost:4567/todos?doneStatus=false'

echo $'\n*************************************************************************************************************'


echo "DELETE request to /todos endpoint without specifying todo id (should fail - 405)"

curl --location --request DELETE 'http://localhost:4567/todos'

echo $'\n*************************************************************************************************************'


echo "PUT request on /todos without id (should fail - 405)"

curl --location --request PUT 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Test"
}'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id ENDPOINT
# =====================================================

echo "GET existing todo with id=1"

curl --location --request GET 'http://localhost:4567/todos/1'

echo $'\n*************************************************************************************************************'


echo "GET non-existing todo (invalid id=40)"

curl --location --request GET 'http://localhost:4567/todos/40'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing todo id=1"

curl --location --head 'http://localhost:4567/todos/1'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing todo id=40"

curl --location --head 'http://localhost:4567/todos/40'

echo $'\n*************************************************************************************************************'


echo "Update existing todo using POST request to /todos/:id endpoint (amend)"

curl --location --request POST 'http://localhost:4567/todos/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Shred paperwork",
    "doneStatus": true,
    "description": "shredding sensitive info"
}'

echo $'\n*************************************************************************************************************'


echo "POST to non-existing todo id (should fail)"

curl --location --request POST 'http://localhost:4567/todos/999' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Ghost Todo"
}'

echo $'\n*************************************************************************************************************'


echo "Update existing todo using PUT request to /todos/:id endpoint (replace)"

curl --location --request PUT 'http://localhost:4567/todos/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Wash dog",
    "doneStatus": false,
    "description": "giving him a bath"
}'

echo $'\n*************************************************************************************************************'


echo "PUT with partial fields on /todos/:id (check if other fields are erased)"

curl --location --request PUT 'http://localhost:4567/todos/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Partial Update Only"
}'

echo $'\n*************************************************************************************************************'


echo "PUT to non-existing todo id (should fail)"

curl --location --request PUT 'http://localhost:4567/todos/999' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Ghost"
}'

echo $'\n*************************************************************************************************************'


echo "DELETE existing todo"

# First create a todo to delete
curl --location --request POST 'http://localhost:4567/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "To Be Deleted",
    "description": "This todo will be deleted"
}'
echo ""
echo "Now deleting the created todo..."

curl --location --request DELETE 'http://localhost:4567/todos/3'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing todo (should fail - 404)"

curl --location --request DELETE 'http://localhost:4567/todos/999'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/tasksof ENDPOINT (todo-project relationship)
# =====================================================

echo "POST /todos/:id/tasksof : Create todo-project relationship (add project id=1 to todo id=1)"

curl --location --request POST 'http://localhost:4567/todos/1/tasksof' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/tasksof : Create relationship with non-existing project id (should fail)"

curl --location --request POST 'http://localhost:4567/todos/1/tasksof' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/tasksof : Create relationship for non-existing todo (should fail)"

curl --location --request POST 'http://localhost:4567/todos/999/tasksof' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/tasksof : Get all projects related to todo id=2"

curl --location --request GET 'http://localhost:4567/todos/2/tasksof'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/tasksof : Get projects for non-existing todo id=40"

curl --location --request GET 'http://localhost:4567/todos/40/tasksof'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing todo-project relationship"

curl --location --head 'http://localhost:4567/todos/1/tasksof'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing todo-project relationship"

curl --location --head 'http://localhost:4567/todos/40/tasksof'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/tasksof/:id ENDPOINT
# =====================================================

echo "DELETE existing todo-project relationship"

curl --location --request DELETE 'http://localhost:4567/todos/2/tasksof/1'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /todos/:id/tasksof after deleting relationship"

curl --location --request GET 'http://localhost:4567/todos/2/tasksof'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing todo-project relationship (should fail)"

curl --location --request DELETE 'http://localhost:4567/todos/1/tasksof/999'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/categories ENDPOINT (todo-category relationship)
# =====================================================

echo "POST /todos/:id/categories : Create todo-category relationship (add category id=1 to todo id=1)"

curl --location --request POST 'http://localhost:4567/todos/1/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/categories : Create another todo-category relationship (add category id=2 to todo id=1)"

curl --location --request POST 'http://localhost:4567/todos/1/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/categories : Create relationship with non-existing category id (should fail)"

curl --location --request POST 'http://localhost:4567/todos/1/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/categories : Create relationship for non-existing todo (should fail)"

curl --location --request POST 'http://localhost:4567/todos/999/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/categories : Get all categories related to todo id=1"

curl --location --request GET 'http://localhost:4567/todos/1/categories'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/categories : Get categories for non-existing todo id=40"

curl --location --request GET 'http://localhost:4567/todos/40/categories'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing todo-category relationship"

curl --location --head 'http://localhost:4567/todos/1/categories'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing todo-category relationship"

curl --location --head 'http://localhost:4567/todos/40/categories'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/categories/:id ENDPOINT
# =====================================================

echo "DELETE existing todo-category relationship"

curl --location --request DELETE 'http://localhost:4567/todos/1/categories/1'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /todos/:id/categories after deleting relationship"

curl --location --request GET 'http://localhost:4567/todos/1/categories'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing todo-category relationship (should fail)"

curl --location --request DELETE 'http://localhost:4567/todos/1/categories/999'

echo $'\n*************************************************************************************************************'


echo "DONE: All todo capability tests completed"