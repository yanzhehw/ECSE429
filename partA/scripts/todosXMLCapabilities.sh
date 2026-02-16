echo "GET all todos (XML)"

curl --location --request GET 'http://localhost:4567/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for all todos (XML)"

curl --location --head 'http://localhost:4567/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create a new todo with all fields (XML)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Wash Dishes</title>
    <doneStatus>false</doneStatus>
    <description>Home Chore to be done</description>
</todo>'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with only title (minimal fields, XML)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Minimal Todo</title>
</todo>'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with empty body (XML)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo></todo>'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with invalid field (XML)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Test</title>
    <invalidField>value</invalidField>
</todo>'

echo $'\n*************************************************************************************************************'


echo "POST request on /todos endpoint: Create todo with invalid doneStatus type (XML, should fail)"

curl --location --request POST 'http://localhost:4567/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Bad Status</title>
    <doneStatus>notABoolean</doneStatus>
</todo>'

echo $'\n*************************************************************************************************************'


echo "Filter Todos: GET all todos with doneStatus=false (XML)"

curl --location --request GET 'http://localhost:4567/todos?doneStatus=false' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DELETE request to /todos endpoint without specifying todo id (XML, should fail - 405)"

curl --location --request DELETE 'http://localhost:4567/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "PUT request on /todos without id (XML, should fail - 405)"

curl --location --request PUT 'http://localhost:4567/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Test</title>
</todo>'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id ENDPOINT
# =====================================================

echo "GET existing todo with id=1 (XML)"

curl --location --request GET 'http://localhost:4567/todos/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "GET non-existing todo (invalid id=40, XML)"

curl --location --request GET 'http://localhost:4567/todos/40' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing todo id=1 (XML)"

curl --location --head 'http://localhost:4567/todos/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing todo id=40 (XML)"

curl --location --head 'http://localhost:4567/todos/40' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "Update existing todo using POST request to /todos/:id endpoint (amend, XML)"

curl --location --request POST 'http://localhost:4567/todos/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Shred paperwork</title>
    <doneStatus>true</doneStatus>
    <description>shredding sensitive info</description>
</todo>'

echo $'\n*************************************************************************************************************'


echo "POST to non-existing todo id (XML, should fail)"

curl --location --request POST 'http://localhost:4567/todos/999' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Ghost Todo</title>
</todo>'

echo $'\n*************************************************************************************************************'


echo "Update existing todo using PUT request to /todos/:id endpoint (replace, XML)"

curl --location --request PUT 'http://localhost:4567/todos/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Wash dog</title>
    <doneStatus>false</doneStatus>
    <description>giving him a bath</description>
</todo>'

echo $'\n*************************************************************************************************************'


echo "PUT with partial fields on /todos/:id (XML, check if other fields are erased)"

curl --location --request PUT 'http://localhost:4567/todos/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Partial Update Only</title>
</todo>'

echo $'\n*************************************************************************************************************'


echo "PUT to non-existing todo id (XML, should fail)"

curl --location --request PUT 'http://localhost:4567/todos/999' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>Ghost</title>
</todo>'

echo $'\n*************************************************************************************************************'


echo "DELETE existing todo (XML)"

# First create a todo to delete
curl --location --request POST 'http://localhost:4567/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<todo>
    <title>To Be Deleted</title>
    <description>This todo will be deleted</description>
</todo>'
echo ""
echo "Now deleting the created todo..."

curl --location --request DELETE 'http://localhost:4567/todos/3' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing todo (XML, should fail - 404)"

curl --location --request DELETE 'http://localhost:4567/todos/999' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/tasksof ENDPOINT (todo-project relationship)
# =====================================================

# NOTE: Creating relationships with XML body is bugged in this API.
# Using JSON Content-Type for POST relationship creation as workaround.

echo "POST /todos/:id/tasksof : Create todo-project relationship (add project id=1 to todo id=1)"

curl --location --request POST 'http://localhost:4567/todos/1/tasksof' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/tasksof : Attempt relationship creation with XML body (KNOWN BUG - may fail)"

curl --location --request POST 'http://localhost:4567/todos/1/tasksof' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<id>1</id>'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/tasksof : Create relationship with non-existing project id (XML, should fail)"

curl --location --request POST 'http://localhost:4567/todos/1/tasksof' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/tasksof : Create relationship for non-existing todo (XML, should fail)"

curl --location --request POST 'http://localhost:4567/todos/999/tasksof' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/tasksof : Get all projects related to todo id=2 (XML)"

curl --location --request GET 'http://localhost:4567/todos/2/tasksof' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/tasksof : Get projects for non-existing todo id=40 (XML)"

curl --location --request GET 'http://localhost:4567/todos/40/tasksof' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing todo-project relationship (XML)"

curl --location --head 'http://localhost:4567/todos/1/tasksof' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing todo-project relationship (XML)"

curl --location --head 'http://localhost:4567/todos/40/tasksof' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/tasksof/:id ENDPOINT
# =====================================================

echo "DELETE existing todo-project relationship (XML)"

curl --location --request DELETE 'http://localhost:4567/todos/2/tasksof/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /todos/:id/tasksof after deleting relationship (XML)"

curl --location --request GET 'http://localhost:4567/todos/2/tasksof' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing todo-project relationship (XML, should fail)"

curl --location --request DELETE 'http://localhost:4567/todos/1/tasksof/999' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/categories ENDPOINT (todo-category relationship)
# =====================================================

echo "POST /todos/:id/categories : Create todo-category relationship (add category id=1 to todo id=1)"

curl --location --request POST 'http://localhost:4567/todos/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/categories : Create another todo-category relationship (add category id=2 to todo id=1)"

curl --location --request POST 'http://localhost:4567/todos/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/categories : Attempt relationship creation with XML body (KNOWN BUG - may fail)"

curl --location --request POST 'http://localhost:4567/todos/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<id>1</id>'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/categories : Create relationship with non-existing category id (XML, should fail)"

curl --location --request POST 'http://localhost:4567/todos/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /todos/:id/categories : Create relationship for non-existing todo (XML, should fail)"

curl --location --request POST 'http://localhost:4567/todos/999/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/categories : Get all categories related to todo id=1 (XML)"

curl --location --request GET 'http://localhost:4567/todos/1/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "GET /todos/:id/categories : Get categories for non-existing todo id=40 (XML)"

curl --location --request GET 'http://localhost:4567/todos/40/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing todo-category relationship (XML)"

curl --location --head 'http://localhost:4567/todos/1/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing todo-category relationship (XML)"

curl --location --head 'http://localhost:4567/todos/40/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /todos/:id/categories/:id ENDPOINT
# =====================================================

echo "DELETE existing todo-category relationship (XML)"

curl --location --request DELETE 'http://localhost:4567/todos/1/categories/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /todos/:id/categories after deleting relationship (XML)"

curl --location --request GET 'http://localhost:4567/todos/1/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing todo-category relationship (XML, should fail)"

curl --location --request DELETE 'http://localhost:4567/todos/1/categories/999' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DONE: All todo XML capability tests completed"