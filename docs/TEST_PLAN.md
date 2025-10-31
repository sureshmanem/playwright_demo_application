# Insurance Policy Management Application - Comprehensive Test Plan

## 1. Application Overview

The Insurance Policy Management application is a web-based tool for managing insurance policies. It allows users to create new policy quotes, view a list of all policies, activate policies from a 'Quote' status to 'Active', and delete policies. The application is built with Python (Flask) and uses a PostgreSQL database for data storage.

## 2. Test Scenarios

### 2.1. Adding New Quotes (Create)

#### 2.1.1. Add a Valid Quote (Happy Path)
**Steps:**
1.  Navigate to the application's home page.
2.  In the "Create a New Quote" form, enter a valid **Applicant Name** (e.g., "John Doe").
3.  Select a **Policy Type** from the dropdown (e.g., "Auto").
4.  Enter a valid **Coverage Amount** (e.g., "50000").
5.  Enter a valid **Premium** (e.g., "500").
6.  Click the "Add Quote" button.

**Expected Results:**
*   The page should refresh, and the new policy should appear in the "Current Policies" table.
*   The new policy should have the correct Applicant Name, Policy Type, Coverage Amount, and Premium.
*   The status of the new policy should be "Quote".
*   The form fields should be cleared.

#### 2.1.2. Add a Quote with Missing Required Fields
**Steps:**
1.  Navigate to the application's home page.
2.  Leave the **Applicant Name** field blank.
3.  Fill in the other fields with valid data.
4.  Click the "Add Quote" button.

**Expected Results:**
*   The form should not submit.
*   The browser's built-in validation should prompt the user to fill out the "Applicant Name" field.
*   (Repeat this test for other required fields: `coverage_amount`, `premium`).

#### 2.1.3. Add a Quote with Zero Values
**Steps:**
1.  Navigate to the application's home page.
2.  Fill in the form with a valid **Applicant Name** and **Policy Type**.
3.  Enter "0" for both **Coverage Amount** and **Premium**.
4.  Click the "Add Quote" button.

**Expected Results:**
*   The policy should be added successfully to the "Current Policies" table with coverage and premium values of "$0.00".

#### 2.1.4. Add a Quote with a Long Applicant Name
**Steps:**
1.  Navigate to the application's home page.
2.  Enter a very long string (e.g., 200 characters) for the **Applicant Name**.
3.  Fill in the other fields with valid data.
4.  Click the "Add Quote" button.

**Expected Results:**
*   The policy should be added successfully, and the full name should be displayed correctly in the table without breaking the UI layout (it should wrap or be truncated as expected).

### 2.2. Viewing Policies (Read)

#### 2.2.1. View Policies on Initial Load
**Steps:**
1.  Ensure the database is empty.
2.  Navigate to the application's home page.

**Expected Results:**
*   The page should load correctly.
*   The "Current Policies" table should be visible but should contain no rows of data.

#### 2.2.2. View Multiple Policies
**Steps:**
1.  Add several policies with different data.
2.  Navigate to the application's home page.

**Expected Results:**
*   All added policies should be listed in the "Current Policies" table.
*   The policies should be ordered by their ID.
*   The data in each column (ID, Applicant, Type, Coverage, Premium, Status) should be correct and properly formatted.

### 2.3. Updating Policy Status (Update)

#### 2.3.1. Activate a Policy
**Steps:**
1.  Add a new policy, which will have a status of "Quote".
2.  In the "Current Policies" table, locate the new policy.
3.  Click the "Activate" button in the "Actions" column for that policy.

**Expected Results:**
*   The page should refresh.
*   The status of the policy should change from "Quote" to "Active".
*   The "Activate" button should no longer be visible for that policy.

### 2.4. Deleting Policies (Delete)

#### 2.4.1. Delete a Policy
**Steps:**
1.  Add a new policy.
2.  In the "Current Policies" table, locate the policy.
3.  Click the "Delete" button in the "Actions" column.

**Expected Results:**
*   The page should refresh.
*   The policy should be removed from the "Current Policies" table.

#### 2.4.2. Delete All Policies
**Steps:**
1.  Add multiple policies.
2.  Delete each policy one by one using the "Delete" button.

**Expected Results:**
*   After deleting all policies, the "Current Policies" table should be empty.

### 2.5. Data Validation and Integrity

#### 2.5.1. Attempt to Submit Form with Invalid Numeric Data
**Steps:**
1.  Navigate to the application's home page.
2.  Enter non-numeric text (e.g., "abc") into the **Coverage Amount** field.
3.  Fill in other fields with valid data.
4.  Click the "Add Quote" button.

**Expected Results:**
*   The form should not submit.
*   The browser's built-in validation for number fields should prevent submission and prompt the user to enter a valid number.
*   (Repeat this test for the `premium` field).
