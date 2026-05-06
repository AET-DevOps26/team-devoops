| ID | Type    | Title                    | Description                                                                                                                   | System   |
| -- | ------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1  | Task    | Setup Project Structure  | Initialize folder structure; setup basic web client, Spring Boot service, and Python service according to Artemis guidelines. | Infra    |
| 2  | Task    | Setup Docker Compose     | Create Dockerfiles for all services and a docker-compose.yml to orchestrate the cluster locally.                              | Infra    |
| 3  | Task    | Implement CI/CD Pipeline | CI: PR builds + tests/lint/vulncheck. CD: Automatic deployment to Kubernetes on merge to main.                                | Infra    |
| 4  | Task    | Define OpenAPI           | Design API specs and implement code generators; integrate OpenAPI linter as a pre-commit hook.                                | Server   |
| 5  | Feature | OAuth2 & Authentication  | Implement OAuth2 at the Gateway level for auth/role verification; include login, signup, and basic role management.           | Server   |
| 6  | Feature | PostgreSQL Persistence   | Setup database containers with persistent storage, design schema, and connect services using authenticated secrets.           | Database |
| 7  | Feature | Member Data Service      | Implement backend API for member CRUD operations (listing, patching details, creating, and deleting).                         | Server   |
| 8  | Feature | Event Service            | Backend for event management, including attendance tracking and trainer notes per member.                                     | Server   |
| 9  | Feature | Payment Service          | API to track one-time and recurring (annual/monthly) payments linked to specific members.                                     | Server   |
| 10 | Feature | Letter Service           | PDF generation from HTML/MD templates with dynamic member data; integrated mass mailing functionality.                        | Server   |
| 11 | Feature | GenAI Helper Service     | Python service to analyze event/member data and trainer notes to provide insights for members and trainers.                   | GenAI    |
| 12 | Feature | Member Data Frontend     | UI for owners to manage members/roles; restricted views for members and trainers to see specific data.                        | Client   |
| 13 | Feature | Event Frontend           | List/Calendar views with filtering. Attendance entry for trainers and event visibility for members.                           | Client   |
| 14 | Feature | Payment Frontend         | Dashboard for owners to track payment status; personal payment history view for members.                                      | Client   |
| 15 | Feature | Letter Frontend          | Integrated editor for creating and managing letter/email templates.                                                           | Client   |
| 16 | Feature | GenAI Chat Integration   | Frontend chat interface for members and trainers to interact with the GenAI helper for performance/nutrition tips.            | Client   |
