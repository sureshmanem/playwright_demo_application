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

## Prompt

You are an expert AI assistant. Use the following prompt to build and test this application from scratch.

---

**Prompt:**

Your task is to build, run, and test a dockerized web application.

1.  **Build and Run the Application:**
    - Execute the command `docker-compose up --build -d` to build the Docker images and run the application services in detached mode.
    - Verify that the application is running by checking the container logs or accessing `http://localhost:8000`.

2.  **Install Testing Dependencies:**
    - Run the command `npm install` to install the necessary Node.js packages for testing.

3.  **Execute the Automated Tests:**
    - Run the command `npm test` to execute the full suite of Playwright tests against the running application.
    - Capture and report the final test results.

4.  **Shut Down the Application:**
    - Once testing is complete, execute `docker-compose down` to stop and remove all running containers, networks, and volumes associated with the application.
