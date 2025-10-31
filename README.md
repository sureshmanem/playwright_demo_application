# Insurance Policy Management System

This project provides a complete, self-contained, dockerized application environment that simulates a simple Insurance Policy Management System. It includes a Python Flask web service and a PostgreSQL database, orchestrated with `docker-compose`.

## Architecture

*   **Web Service (`web`):** A Python Flask application that provides a web interface for managing insurance policies.
*   **Database Service (`db`):** A PostgreSQL database (`postgres:14-alpine`) to store policy data.
*   **Orchestration:** A `docker-compose.yml` file links and manages both services. The web service is configured to wait for the database service to be healthy before starting.

## Features

*   **CRUD Operations:**
    *   **Create:** Add new policy quotes via a web form.
    *   **Read:** View all policies in a clean, tabular format.
    *   **Update:** Change a policy's status from 'Quote' to 'Active'.
    *   **Delete:** Remove a policy from the system.
*   **Database:** The application automatically creates a `policies` table on startup if it doesn't exist.
*   **Robustness:** The Python application includes a database connection retry logic with exponential backoff to gracefully handle the startup order of the services.
*   **Styling:** The UI is styled with Tailwind CSS for a modern and clean look.

## Setup and Running the Application

### Prerequisites

*   Docker
*   Docker Compose

### Steps

1.  **Navigate to the project directory:**
    Make sure you are in the `demo_app` directory containing all the project files.

2.  **Build and run the services:**
    Open a terminal and run the following command:
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker image for the web service, pull the PostgreSQL image, and start both containers. The `-d` flag can be used to run the containers in detached mode.

3.  **Access the application:**
    Once the services are running, open your web browser and navigate to:
    [http://localhost:8000](http://localhost:8000)

    You should see the Insurance Policy Management System interface.

## Automated Testing

This project includes a full suite of automated end-to-end tests built with Playwright.

For a detailed test plan and instructions on how to run the tests and view reports, please see the documentation in the `docs` directory:

-   **[Test Plan](./docs/TEST_PLAN.md):** A comprehensive list of all test scenarios.
-   **[Running Tests](./docs/TESTS_README.md):** Step-by-step guide to installing dependencies and running the test suite.

## Stopping the Application

To stop and remove the containers, networks, and volumes, run the following command in the `demo_app` directory:

```bash
docker-compose down
```
To stop the containers without removing the data volume, you can use:
```bash
docker-compose stop
```
