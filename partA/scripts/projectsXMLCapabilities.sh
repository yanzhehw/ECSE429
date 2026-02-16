echo "========== GET /projects : Get all projects (XML) =========="

curl --location --request GET 'http://localhost:4567/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects : Headers for all projects (XML) =========="

curl --location --head 'http://localhost:4567/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create a new project with all fields (XML) =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <active>false</active>
    <description>Meeting for 429 group</description>
    <completed>false</completed>
    <title>School</title>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create project with only title (minimal fields, XML) =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>Minimal Project</title>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create project with empty body (XML) =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project></project>'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create project with invalid field (XML) =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>Test</title>
    <invalidField>value</invalidField>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects : DELETE request without specifying project id (XML, should fail - 405) =========="

curl --location --request DELETE 'http://localhost:4567/projects' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects : PUT request on /projects without id (XML, should fail - 405) =========="

curl --location --request PUT 'http://localhost:4567/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>Test</title>
</project>'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id ENDPOINT
# =====================================================

echo "========== GET /projects/:id : Get project with id=1 (XML) =========="

curl --location --request GET 'http://localhost:4567/projects/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id : Get non-existing project (invalid id=50, XML) =========="

curl --location --request GET 'http://localhost:4567/projects/50' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id : HEAD request for existing project id=1 (XML) =========="

curl --location --head 'http://localhost:4567/projects/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id : HEAD request for non-existing project id=50 (XML) =========="

curl --location --head 'http://localhost:4567/projects/50' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id : Update existing project using POST (amend, XML) =========="

curl --location --request POST 'http://localhost:4567/projects/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <active>true</active>
    <description>Meeting for Exploratory Testing session</description>
    <completed>false</completed>
    <title>University</title>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id : POST to non-existing project id (XML, should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/999' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>Ghost Project</title>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects/:id : Update existing project using PUT (replace, XML) =========="

curl --location --request PUT 'http://localhost:4567/projects/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <active>true</active>
    <description>Unclog Sink</description>
    <completed>false</completed>
    <title>Kitchen</title>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects/:id : PUT with partial fields (XML, check if other fields are erased) =========="

curl --location --request PUT 'http://localhost:4567/projects/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>Partial Update Only</title>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects/:id : PUT to non-existing project id (XML, should fail) =========="

curl --location --request PUT 'http://localhost:4567/projects/999' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>Ghost</title>
</project>'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id : Delete existing project (XML) =========="

# First create a project to delete
curl --location --request POST 'http://localhost:4567/projects' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>To Be Deleted</title>
    <description>This project will be deleted</description>
</project>'
echo ""
echo "Now deleting the created project..."

curl --location --request DELETE 'http://localhost:4567/projects/2' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id : Delete non-existing project (XML, should fail - 404) =========="

curl --location --request DELETE 'http://localhost:4567/projects/999' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/tasks ENDPOINT (project-todo relationship)
# =====================================================

echo "========== Setup: Restore project 1 for relationship tests (XML) =========="

curl --location --request PUT 'http://localhost:4567/projects/1' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<project>
    <title>Office Work</title>
    <description>Main project for testing relationships</description>
</project>'

echo $'\n*************************************************************************************************************'


# NOTE: Creating relationships with XML body is bugged in this API.
# Using JSON Content-Type for POST relationship creation as workaround.

echo "========== POST /projects/:id/tasks : Create project-todo relationship (add todo id=1 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/tasks' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Create another project-todo relationship (add todo id=2 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/tasks' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Attempt relationship creation with XML body (KNOWN BUG - may fail) =========="

curl --location --request POST 'http://localhost:4567/projects/1/tasks' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<id>2</id>'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Create relationship with non-existing todo id (XML, should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/1/tasks' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Create relationship for non-existing project (XML, should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/999/tasks' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/tasks : Get all todos related to project id=1 (XML) =========="

curl --location --request GET 'http://localhost:4567/projects/1/tasks' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/tasks : Get todos for non-existing project id=40 (XML) =========="

curl --location --request GET 'http://localhost:4567/projects/40/tasks' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/tasks : HEAD request for existing project-todo relationship (XML) =========="

curl --location --head 'http://localhost:4567/projects/1/tasks' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/tasks : HEAD request for non-existing project-todo relationship (XML) =========="

curl --location --head 'http://localhost:4567/projects/40/tasks' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/tasks/:id ENDPOINT
# =====================================================

echo "========== DELETE /projects/:id/tasks/:id : Delete existing project-todo relationship (XML) =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/tasks/2' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== Verify deletion: GET /projects/:id/tasks after deleting relationship (XML) =========="

curl --location --request GET 'http://localhost:4567/projects/1/tasks' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id/tasks/:id : Delete non-existing project-todo relationship (XML, should fail) =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/tasks/999' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/categories ENDPOINT (project-category relationship)
# =====================================================

# NOTE: Creating relationships with XML body is bugged in this API.
# Using JSON Content-Type for POST relationship creation as workaround.

echo "========== POST /projects/:id/categories : Create project-category relationship (add category id=1 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/categories : Create another project-category relationship (add category id=2 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/categories : Attempt relationship creation with XML body (KNOWN BUG - may fail) =========="

curl --location --request POST 'http://localhost:4567/projects/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/xml' \
--data-raw '<id>1</id>'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/categories : Create relationship with non-existing category id (XML, should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/1/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/categories : Create relationship for non-existing project (XML, should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/999/categories' \
--header 'Accept: application/xml' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/categories : Get all categories related to project id=1 (XML) =========="

curl --location --request GET 'http://localhost:4567/projects/1/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/categories : Get categories for non-existing project id=20 (XML) =========="

curl --location --request GET 'http://localhost:4567/projects/20/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/categories : HEAD request for existing project-category relationship (XML) =========="

curl --location --head 'http://localhost:4567/projects/1/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/categories : HEAD request for non-existing project-category relationship (XML) =========="

curl --location --head 'http://localhost:4567/projects/20/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/categories/:id ENDPOINT
# =====================================================

echo "========== DELETE /projects/:id/categories/:id : Delete existing project-category relationship (XML) =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/categories/1' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== Verify deletion: GET /projects/:id/categories after deleting relationship (XML) =========="

curl --location --request GET 'http://localhost:4567/projects/1/categories' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id/categories/:id : Delete non-existing project-category relationship (XML, should fail) =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/categories/999' \
--header 'Accept: application/xml'

echo $'\n*************************************************************************************************************'


echo "========== DONE: All project XML capability tests completed =========="