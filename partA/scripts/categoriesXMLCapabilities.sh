echo "GET all categories (XML)"

curl --location --request GET 'http://localhost:4567/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for all categories (XML)"

curl --location --head 'http://localhost:4567/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create a new category with title and description (XML)"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <description>Category for University related stuff!</description>
    <title>University</title>
</category>'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create category with only title (minimal fields, XML)"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>Minimal Category</title>
</category>'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create category with empty body (XML)"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category></category>'

echo $'\n*************************************************************************************************************'


echo "POST request on /categories endpoint: Create category with invalid field (XML)"

curl --location --request POST 'http://localhost:4567/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>Test</title>
    <invalidField>value</invalidField>
</category>'

echo $'\n*************************************************************************************************************'


echo "DELETE request to /categories endpoint without specifying category id (XML, should fail - 405)"

curl --location --request DELETE 'http://localhost:4567/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "PUT request on /categories without id (XML, should fail - 405)"

curl --location --request PUT 'http://localhost:4567/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>Test</title>
</category>'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id ENDPOINT
# =====================================================

echo "GET category with id=1 (XML)"

curl --location --request GET 'http://localhost:4567/categories/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "GET category with non-existing id=20 (XML)"

curl --location --request GET 'http://localhost:4567/categories/20' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for category with existing id=1 (XML)"

curl --location --head 'http://localhost:4567/categories/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for category with non-existing id=20 (XML)"

curl --location --head 'http://localhost:4567/categories/20' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "Update existing category using POST request to /categories/:id endpoint (amend, XML)"

curl --location --request POST 'http://localhost:4567/categories/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>College</title>
    <description>Updated description</description>
</category>'

echo $'\n*************************************************************************************************************'


echo "POST to non-existing category id (XML, should fail)"

curl --location --request POST 'http://localhost:4567/categories/999' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>Ghost Category</title>
</category>'

echo $'\n*************************************************************************************************************'


echo "Update existing category using PUT request to /categories/:id endpoint (replace, XML)"

curl --location --request PUT 'http://localhost:4567/categories/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>University</title>
    <description>Replaced description</description>
</category>'

echo $'\n*************************************************************************************************************'


echo "PUT with partial fields on /categories/:id (XML, check if other fields are erased)"

curl --location --request PUT 'http://localhost:4567/categories/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>Partial Update Only</title>
</category>'

echo $'\n*************************************************************************************************************'


echo "PUT to non-existing category id (XML, should fail)"

curl --location --request PUT 'http://localhost:4567/categories/999' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>Ghost</title>
</category>'

echo $'\n*************************************************************************************************************'


echo "DELETE existing category (XML)"

# First create a category to delete
curl --location --request POST 'http://localhost:4567/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<category>
    <title>To Be Deleted</title>
    <description>This category will be deleted</description>
</category>'
echo ""
echo "Now deleting the created category..."

curl --location --request DELETE 'http://localhost:4567/categories/3' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing category (XML, should fail - 404)"

curl --location --request DELETE 'http://localhost:4567/categories/999' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/projects ENDPOINT (category-project relationship)
# =====================================================

# NOTE: Creating relationships with XML body is bugged in this API.
# Using JSON Content-Type for POST relationship creation as workaround.

echo "POST /categories/:id/projects : Create category-project relationship (add project id=1 to category id=1)"

curl --location --request POST 'http://localhost:4567/categories/1/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/projects : Attempt relationship creation with XML body (KNOWN BUG - may fail)"

curl --location --request POST 'http://localhost:4567/categories/1/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<id>1</id>'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/projects : Create relationship with non-existing project id (XML, should fail)"

curl --location --request POST 'http://localhost:4567/categories/1/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/projects : Create relationship for non-existing category (XML, should fail)"

curl --location --request POST 'http://localhost:4567/categories/999/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/projects : Get all projects related to category id=1 (XML)"

curl --location --request GET 'http://localhost:4567/categories/1/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/projects : Get projects for non-existing category id=20 (XML)"

curl --location --request GET 'http://localhost:4567/categories/20/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing category-project relationship (XML)"

curl --location --head 'http://localhost:4567/categories/1/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing category-project relationship (XML)"

curl --location --head 'http://localhost:4567/categories/20/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/projects/:id ENDPOINT
# =====================================================

echo "DELETE existing category-project relationship (XML)"

curl --location --request DELETE 'http://localhost:4567/categories/1/projects/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /categories/:id/projects after deleting relationship (XML)"

curl --location --request GET 'http://localhost:4567/categories/1/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing category-project relationship (XML, should fail)"

curl --location --request DELETE 'http://localhost:4567/categories/20/projects/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/todos ENDPOINT (category-todo relationship)
# =====================================================

echo "POST /categories/:id/todos : Create category-todo relationship (add todo id=1 to category id=1)"

curl --location --request POST 'http://localhost:4567/categories/1/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/todos : Create another category-todo relationship (add todo id=2 to category id=1)"

curl --location --request POST 'http://localhost:4567/categories/1/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/todos : Attempt relationship creation with XML body (KNOWN BUG - may fail)"

curl --location --request POST 'http://localhost:4567/categories/1/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<id>1</id>'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/todos : Create relationship with non-existing todo id (XML, should fail)"

curl --location --request POST 'http://localhost:4567/categories/1/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "POST /categories/:id/todos : Create relationship for non-existing category (XML, should fail)"

curl --location --request POST 'http://localhost:4567/categories/999/todos' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/todos : Get all todos related to category id=1 (XML)"

curl --location --request GET 'http://localhost:4567/categories/1/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "GET /categories/:id/todos : Get todos for non-existing category id=20 (XML)"

curl --location --request GET 'http://localhost:4567/categories/20/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for existing category-todo relationship (XML)"

curl --location --head 'http://localhost:4567/categories/1/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "HEAD request for non-existing category-todo relationship (XML)"

curl --location --head 'http://localhost:4567/categories/20/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /categories/:id/todos/:id ENDPOINT
# =====================================================

echo "DELETE existing category-todo relationship (XML)"

curl --location --request DELETE 'http://localhost:4567/categories/1/todos/2' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "Verify deletion: GET /categories/:id/todos after deleting relationship (XML)"

curl --location --request GET 'http://localhost:4567/categories/1/todos' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DELETE non-existing category-todo relationship (XML, should fail)"

curl --location --request DELETE 'http://localhost:4567/categories/20/todos/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "DONE: All categories XML capability tests completed"