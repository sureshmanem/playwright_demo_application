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


## Testing the Application

### 1. Prerequisites

- **Docker** and **Docker Compose** (for the app)
- **Node.js** and **npm** (for Playwright tests)
- An [OpenAI API key](https://platform.openai.com/account/api-keys) (for GenAI-powered features)

### 2. Running the Application

1. **Start the app and database:**
     ```bash
     docker-compose up --build
     ```
     The app will be available at [http://localhost:8000](http://localhost:8000).

2. **(Optional) Stop the app:**
     ```bash
     docker-compose down
     ```

### 3. Installing Test Dependencies

1. **Install Node.js dependencies:**
     ```bash
     npm install
     ```
2. **Install Playwright browsers:**
     ```bash
     npx playwright install --with-deps
     ```

### 4. Running the Test Suite

- **Run all tests and generate an HTML report:**
    ```bash
    npm run test:ci
    ```
- **View the HTML report:**
    ```bash
    npm run test:report
    ```
    The report will open in your browser and is also saved in the `playwright-report/` directory.

- **See [docs/TEST_PLAN.md](./docs/TEST_PLAN.md)** for a full list of test scenarios.
- **See [docs/TESTS_README.md](./docs/TESTS_README.md)** for more details on test execution.

---

## Using the GenAI Self-Healing Solution for Playwright Tests

This project includes an advanced, AI-powered self-healing mechanism for Playwright selectors, leveraging OpenAI's GPT models. If a test fails due to a broken selector, the system can automatically suggest and try a new selector, log the suggestion, and allow you to review and approve it.

### How It Works

1. **Test Failure Detection:**
     - When a Playwright test fails due to a selector not found, the self-healing fixture (`tests/fixtures/selfHealing.fixture.ts`) intercepts the error.

2. **AI Selector Suggestion:**
     - The failing code, error message, and a DOM snapshot are sent to OpenAI via the `suggestNewSelector` utility.
     - The AI suggests a new, more robust selector.

3. **Automatic Retry:**
     - The test automatically retries the action using the AI-suggested selector.
     - The suggestion and context are logged in `selector-suggestions.log.json` for review.

4. **Logging and Review:**
     - All selector suggestions are logged with context (test file, error, DOM snapshot).
     - Use the utilities in `utils/selectorSuggestionLog.ts` to review and approve suggestions.

5. **Patching Test Files:**
     - Once a suggestion is approved, use `patchSelectorInFile` to update the test file with the new selector.

### Example: Self-Healing Test

See `tests/self-healing-selector.spec.ts` for a working example:

```typescript
test('Self-healing selector: try fallback on failure', async ({ page, recoverSelector }) => {
    await page.goto('http://localhost:8000');
    try {
        await page.click('button#submit'); // Intentionally broken selector
    } catch (error) {
        const newSelector = await recoverSelector({
            page,
            failingCode: "await page.click('button#submit')",
            error: String(error),
            testFile: __filename,
            selector: 'button#submit'
        });
        if (newSelector) {
            await page.click(newSelector);
            expect(true).toBe(true);
        } else {
            throw new Error('No new selector suggested by AI');
        }
    }
});
```

### Enabling GenAI Features

- **Set your OpenAI API key** in your environment:
    ```bash
    export OPENAI_API_KEY=sk-...
    ```
- The AI-powered utilities are in the `utils/` directory:
    - `generateTestData.ts`: Generate test data using OpenAI.
    - `generatePlaywrightSteps.ts`: Generate Playwright steps from a prompt.
    - `suggestNewSelector.ts`: Suggest new selectors on failure.
    - `patchSelectorInFile.ts`: Patch test files with new selectors.
    - `selectorSuggestionLog.ts`: Log and review selector suggestions.
    - `validateSteps.ts`: Validate Playwright steps before execution.

### Workflow Summary

1. Run tests as usual.
2. If a selector fails, the AI will suggest a new one and retry.
3. Review suggestions in `selector-suggestions.log.json`.
4. Approve and patch selectors as needed.

---

For more details, see the `docs/` directory and the `utils/` folder for all GenAI-powered utilities.
