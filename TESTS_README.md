Playwright test runner

To install dependencies and Playwright browsers:

```bash
cd /Users/lallu/Downloads/demo_app
npm install
npx playwright install --with-deps
```

Run tests and generate an HTML report:

```bash
npm run test:ci
```

Open the generated HTML report:

```bash
npm run test:report
```

Notes:
- The test suite assumes the application is available at http://localhost:8000. Use `docker-compose up --build` to start the app if needed.
- The report is written to the `playwright-report` folder.
