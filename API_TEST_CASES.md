# API Test Cases

## 1. Submit Enquiry Successfully

- **ID:** API-001
- **Category:** Enquiry API
- **Scenario / Description:** Verify that a valid enquiry submission is accepted and stored.
- **Steps:**
  1. Open Postman.
  2. Send a POST request to `/api/enquiries`.
  3. Enter valid enquiry details such as name, email, phone, company name, country, job title, and job details.
  4. Click **Send**.
  5. Check the response and database.
- **Expected Results:**
  - Status code should be `201`.
  - Response should contain a success message.
  - The enquiry should be saved in the database.
- **Actual Results:**
  - To be filled after testing.
- **Status:**
  - Pending
- **Evidence:**
  - Response body, screenshot, or database record.

## 2. Submit Enquiry With Missing Data

- **ID:** API-002
- **Category:** Enquiry API
- **Scenario / Description:** Verify that the API rejects incomplete enquiry data.
- **Steps:**
  1. Open Postman.
  2. Send a POST request to `/api/enquiries`.
  3. Leave out one or more required fields.
  4. Click **Send**.
  5. Check the response.
- **Expected Results:**
  - The API should return an error response.
  - Status code should be `400` or `422`.
- **Actual Results:**
  - To be filled after testing.
- **Status:**
  - Pending
- **Evidence:**
  - Response body or error message.

## 3. Chatbot Returns Fallback for Out-of-Scope Question

- **ID:** API-003
- **Category:** Chat API
- **Scenario / Description:** Verify that the chatbot returns the fallback message for a question unrelated to AI-Solutions.
- **Steps:**
  1. Open Postman.
  2. Send a POST request to `/api/chat`.
  3. Send a question such as “What is the weather today?”
  4. Click **Send**.
  5. Check the response.
- **Expected Results:**
  - Status code should be `200`.
  - The response should contain the fallback message.
- **Actual Results:**
  - To be filled after testing.
- **Status:**
  - Pending
- **Evidence:**
  - Response body.

## 4. Get All Enquiries

- **ID:** API-004
- **Category:** Enquiry API
- **Scenario / Description:** Verify that the API returns all enquiries successfully.
- **Steps:**
  1. Open Postman.
  2. Send a GET request to `/api/enquiries`.
  3. Click **Send**.
  4. Check the response body.
- **Expected Results:**
  - Status code should be `200`.
  - The response should return enquiry data.
- **Actual Results:**
  - To be filled after testing.
- **Status:**
  - Pending
- **Evidence:**
  - Response body or screenshot.

## 5. Get Event Details by ID

- **ID:** API-005
- **Category:** Event API
- **Scenario / Description:** Verify that the API returns the correct event details for a valid event ID.
- **Steps:**
  1. Open Postman.
  2. Send a GET request to `/api/events/:id`.
  3. Replace `:id` with a valid event ID.
  4. Click **Send**.
  5. Check the response.
- **Expected Results:**
  - Status code should be `200`.
  - The response should return the correct event details.
- **Actual Results:**
  - To be filled after testing.
- **Status:**
  - Pending
- **Evidence:**
  - Response body.
