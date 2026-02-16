echo "========== GET /projects : Get all projects =========="

curl --location --request GET 'http://localhost:4567/projects'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects : Headers for all projects =========="

curl --location --head 'http://localhost:4567/projects'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create a new project with title, description, active, completed =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "School",
    "description": "Meeting for 429 group",
    "active": false,
    "completed": false
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create project with only title (minimal fields) =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Minimal Project"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Attempt to create project with an id in the request body (should fail) =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 10,
    "title": "School",
    "description": "Meeting for 429 group"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create project with empty body =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Content-Type: application/json' \
--data-raw '{}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects : Create project with invalid field =========="

curl --location --request POST 'http://localhost:4567/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Test",
    "invalidField": "value"
}'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects : DELETE request without specifying project id (should fail - 405) =========="

curl --location --request DELETE 'http://localhost:4567/projects'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects : PUT request on /projects without id (should fail - 405) =========="

curl --location --request PUT 'http://localhost:4567/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Test"
}'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id ENDPOINT
# =====================================================

echo "========== GET /projects/:id : Get project with id=1 =========="

curl --location --request GET 'http://localhost:4567/projects/1'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id : Get non-existing project (invalid id=50) =========="

curl --location --request GET 'http://localhost:4567/projects/50'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id : HEAD request for existing project id=1 =========="

curl --location --head 'http://localhost:4567/projects/1'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id : HEAD request for non-existing project id=50 =========="

curl --location --head 'http://localhost:4567/projects/50'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id : Update existing project using POST (amend) =========="

curl --location --request POST 'http://localhost:4567/projects/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "University",
    "description": "Meeting for Exploratory Testing session",
    "active": true
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id : POST to non-existing project id (should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/999' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Ghost Project"
}'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects/:id : Update existing project using PUT (replace) =========="

curl --location --request PUT 'http://localhost:4567/projects/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Kitchen",
    "description": "Unclog Sink",
    "active": true,
    "completed": false
}'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects/:id : PUT with partial fields (check if other fields are erased) =========="

curl --location --request PUT 'http://localhost:4567/projects/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Partial Update Only"
}'

echo $'\n*************************************************************************************************************'


echo "========== PUT /projects/:id : PUT to non-existing project id (should fail) =========="

curl --location --request PUT 'http://localhost:4567/projects/999' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Ghost"
}'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id : Delete existing project =========="

# First create a project to delete
curl --location --request POST 'http://localhost:4567/projects' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "To Be Deleted",
    "description": "This project will be deleted"
}'
echo ""
echo "Now deleting the created project..."

curl --location --request DELETE 'http://localhost:4567/projects/2'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id : Delete non-existing project (should fail - 404) =========="

curl --location --request DELETE 'http://localhost:4567/projects/999'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/tasks ENDPOINT (project-todo relationship)
# =====================================================

echo "========== Setup: Restore project 1 for relationship tests =========="

curl --location --request PUT 'http://localhost:4567/projects/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Office Work",
    "description": "Main project for testing relationships"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Create project-todo relationship (add todo id=1 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Create another project-todo relationship (add todo id=2 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Create relationship with non-existing todo id (should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/1/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/tasks : Create relationship for non-existing project (should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/999/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/tasks : Get all todos related to project id=1 =========="

curl --location --request GET 'http://localhost:4567/projects/1/tasks'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/tasks : Get todos for non-existing project id=40 =========="

curl --location --request GET 'http://localhost:4567/projects/40/tasks'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/tasks : HEAD request for existing project-todo relationship =========="

curl --location --head 'http://localhost:4567/projects/1/tasks'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/tasks : HEAD request for non-existing project-todo relationship =========="

curl --location --head 'http://localhost:4567/projects/40/tasks'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/tasks/:id ENDPOINT
# =====================================================

echo "========== DELETE /projects/:id/tasks/:id : Delete existing project-todo relationship =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/tasks/2'

echo $'\n*************************************************************************************************************'


echo "========== Verify deletion: GET /projects/:id/tasks after deleting relationship =========="

curl --location --request GET 'http://localhost:4567/projects/1/tasks'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id/tasks/:id : Delete non-existing project-todo relationship (should fail) =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/tasks/999'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/categories ENDPOINT (project-category relationship)
# =====================================================

echo "========== POST /projects/:id/categories : Create project-category relationship (add category id=1 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/categories : Create another project-category relationship (add category id=2 to project id=1) =========="

curl --location --request POST 'http://localhost:4567/projects/1/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "2"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/categories : Create relationship with non-existing category id (should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/1/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "999"
}'

echo $'\n*************************************************************************************************************'


echo "========== POST /projects/:id/categories : Create relationship for non-existing project (should fail) =========="

curl --location --request POST 'http://localhost:4567/projects/999/categories' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1"
}'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/categories : Get all categories related to project id=1 =========="

curl --location --request GET 'http://localhost:4567/projects/1/categories'

echo $'\n*************************************************************************************************************'


echo "========== GET /projects/:id/categories : Get categories for non-existing project id=20 =========="

curl --location --request GET 'http://localhost:4567/projects/20/categories'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/categories : HEAD request for existing project-category relationship =========="

curl --location --head 'http://localhost:4567/projects/1/categories'

echo $'\n*************************************************************************************************************'


echo "========== HEAD /projects/:id/categories : HEAD request for non-existing project-category relationship =========="

curl --location --head 'http://localhost:4567/projects/20/categories'

echo $'\n*************************************************************************************************************'


# =====================================================
# /projects/:id/categories/:id ENDPOINT
# =====================================================

echo "========== DELETE /projects/:id/categories/:id : Delete existing project-category relationship =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/categories/1'

echo $'\n*************************************************************************************************************'


echo "========== Verify deletion: GET /projects/:id/categories after deleting relationship =========="

curl --location --request GET 'http://localhost:4567/projects/1/categories'

echo $'\n*************************************************************************************************************'


echo "========== DELETE /projects/:id/categories/:id : Delete non-existing project-category relationship (should fail) =========="

curl --location --request DELETE 'http://localhost:4567/projects/1/categories/999'

echo $'\n*************************************************************************************************************'


echo "========== DONE: All project capability tests completed =========="