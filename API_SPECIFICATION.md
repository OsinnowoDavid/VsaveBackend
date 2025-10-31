# Vsave Backend API Specification

This document provides a comprehensive list of all exposed RESTful API endpoints for the Vsave Backend. This specification enables seamless integration for the frontend and analytics consumers.

**Base URL:** `[Your Server Host]/api/v1`

Note: The repository includes a compiled server build in the `dist/` folder. Deployments can run the compiled code (node dist/index.js). The `dist` folder is production-ready JS built from the TypeScript source and contains the runtime server and any analytics aggregation logic used in endpoints described below.

## General Information

-   **Authentication:** Protected routes require a JSON Web Token (JWT) in the `Authorization` header: `Authorization: Bearer <token>`.
-   **Request/Response Format:** JSON.
-   **Password Hashing:** Argon2.
-   **User Types:** User, Regional Admin, Super Admin.
-   **Analytics:** Aggregate and realtime endpoints provided under `/analytics` (see section 6). Aggregation logic is implemented server-side and available in compiled `dist/` for production.

---

## 1. User Endpoints (`/user`)

These endpoints are for general Vsave users, handling registration, login, email verification, KYC, and value-added services.

| Method   | Path                              | Description                                   | Access          |
| :------- | :-------------------------------- | :-------------------------------------------- | :-------------- |
| **POST** | `/user/register`                  | Registers a new user account.                 | Public          |
| **POST** | `/user/login`                     | Logs in a user and returns a JWT.             | Public          |
| **POST** | `/user/verify-email`              | Verifies a user's email using a token.        | Public          |
| **POST** | `/user/resend-verification-token` | Requests a new email verification token.      | Public          |
| **GET**  | `/user/profile`                   | Retrieves the authenticated user's profile.   | **Auth (User)** |
| **POST** | `/user/register-kyc1`             | Submits the first stage of KYC information.   | **Auth (User)** |
| **GET**  | `/user/get-data-plan/:network`    | Retrieves available data plans for a network. | **Auth (User)** |
| **POST** | `/user/buy-airtime`               | Buys airtime for a phone number.              | **Auth (User)** |
| **POST** | `/user/buy-data`                  | Buys data for a phone number.                 | **Auth (User)** |
| **GET**  | `/user/get-all-banks`             | Retrieves all banks for the user.             | **Auth (User)** |

Refer to the examples in prior sections for request/response shapes. KYC1 is assumed to be POST for data submission.

---

## 2. Super Admin Endpoints (`/admin`)

Endpoints for Super Admin, including registration, authentication, and region/admin management.

| Method   | Path                            | Description                                          | Access                 |
| :------- | :------------------------------ | :--------------------------------------------------- | :--------------------- |
| **POST** | `/admin/register`               | Registers the Super Admin (likely a one-time setup). | Public                 |
| **POST** | `/admin/login`                  | Logs in the Super Admin and returns a JWT.           | Public                 |
| **GET**  | `/admin/profile`                | Retrieves the authenticated Super Admin's profile.   | **Auth (Super Admin)** |
| **POST** | `/admin/create-region`          | Creates a new region.                                | **Auth (Super Admin)** |
| **POST** | `/admin/create-regional-admin`  | Creates a new regional admin.                        | **Auth (Super Admin)** |
| **GET**  | `/admin/get-all-regional-admin` | Gets all regional admins.                            | **Auth (Super Admin)** |
| **POST** | `/admin/get-all-region`         | Gets all regions.                                    | **Auth (Super Admin)** |
| **GET**  | `/admin/get-regional-admin`     | Gets a regional admin by email.                      | **Auth (Super Admin)** |

Protected: Super Admin JWT.

---

## 3. Regional Admin Endpoints (`/regional-admin`)

Endpoints for Regional Administrators, including authentication and subregion management.

| Method   | Path                                     | Description                                           | Access                    |
| :------- | :--------------------------------------- | :---------------------------------------------------- | :------------------------ |
| **POST** | `/regional-admin/login`                  | Logs in a Regional Admin and returns a JWT.           | Public                    |
| **GET**  | `/regional-admin/profile`                | Retrieves the authenticated Regional Admin's profile. | **Auth (Regional Admin)** |
| **POST** | `/regional-admin/create-subregion`       | Creates a new subregion.                              | **Auth (Regional Admin)** |
| **POST** | `/regional-admin/create-subregion-admin` | Creates a new subregion admin.                        | **Auth (Regional Admin)** |
| **GET**  | `/regional-admin/get-all-subregion`      | Gets all subregions.                                  | **Auth (Regional Admin)** |

Protected: Regional Admin JWT.

---

## 4. Sub-Regional Admin / Agents

-   Sub-regional admin: create/list/manage users within subregions (see routes/SubRegionalAdmin.ts)
-   Agents: create/list/manage; referrals available via Agents_referral model

Protected: SubRegionalAdmin / RegionalAdmin JWT where applicable.

---

## 5. Transactions & Financial Endpoints

-   Transaction creation and retrieval endpoints (deposit, withdrawal, transfer, airtime, data)
-   Transaction fields: transactionReference, amount, feeCharged (optional), balanceBefore, balanceAfter, status
-   Payment gateway integrations: external callbacks/webhooks handled under `/webhook`

Protected: User / Admin roles as appropriate.

---

## 6. Analytics Endpoints (`/analytics`)

New integration: analytics aggregation endpoints. These endpoints are implemented in the server and also compiled into `dist/` for production use. They provide aggregated metrics for dashboards and monitoring.

Access: Require Super Admin or Regional Admin JWT (documented per endpoint).

Endpoints:

-   GET /analytics/summary

    -   Description: Global aggregated metrics (total users, total deposits, total loans outstanding, number of verified users, active agents).
    -   Access: Super Admin
    -   Example response:
        ```json
        {
            "totalUsers": 1024,
            "verifiedUsers": 876,
            "totalDeposits": 150000.5,
            "totalWithdrawals": 45000.0,
            "activeLoans": 134,
            "timestamp": "2025-10-24T12:00:00Z"
        }
        ```

-   GET /analytics/region/:regionId

    -   Description: Aggregated metrics scoped to a region (users, transactions, savings totals, KYC status distribution).
    -   Access: Super Admin, Regional Admin (region-scoped)
    -   Example response:
        ```json
        {
            "regionId": "616...",
            "users": 230,
            "transactions": {
                "count": 980,
                "totalAmount": 45000.0
            },
            "kyc": {
                "pending": 12,
                "verified": 180,
                "rejected": 3
            },
            "timestamp": "2025-10-24T12:00:00Z"
        }
        ```

-   GET /analytics/subregion/:subregionId

    -   Description: Same as region endpoint but scoped to a subregion. Access similar to region.

-   GET /analytics/transactions?from=YYYY-MM-DD&to=YYYY-MM-DD&type=deposit
    -   Description: Time-windowed transaction aggregates & basic time-series for charts.
    -   Access: Super Admin, Regional Admin
    -   Example response includes daily buckets and totals.

Implementation notes:

-   Endpoints use MongoDB aggregation pipelines (look at compiled code in `dist/`).
-   Responses include a timestamp and metadata for cache-control.
-   Pagination applied where needed.

---

## 7. Webhooks (`/webhook`)

-   POST /webhook/payment-callback
    -   Description: Payment gateway callbacks (Paystack/Flutterwave).
    -   Security: Validate signature/header using configured keys (see config/nodemailer.ts & config/JWT.ts for secret patterns).
    -   Persist payload to Webhook model for auditing.

---

## 8. KYC, Loan, Savings, Notifications

-   KYC endpoints: create, update, review status.
-   Loan endpoints: apply, repay, status; repayment history returned in loan object.
-   Savings endpoints: create savings circle, deposit/withdraw savings (refer to models Savings, Savings_circle).
-   Notifications: stored in Notification model and delivered via in-app / email.

---

## 9. Models and Types

-   Models are in `server/model/` (TypeScript source) and types / interfaces in `server/types/index.ts`.
-   Compiled JS (dist) mirrors structure and contains runtime logic used in production deployments.

---

## 10. Deployment & Dist Usage

-   To run compiled server:
    -   Ensure environment variables are set (MONGO_URI, JWT_SECRET, EMAIL credentials, etc.).
    -   Run: `node dist/index.js` (Windows example: `node .\dist\index.js`)
-   For development, run TypeScript source with `ts-node` or `npm run dev` (project scripts).
-   Analytics aggregation code is present in source and also compiled to `dist/` — production deployments should use `dist` for stability.

---

## 11. Security & Best Practices

-   All protected routes require JWT and role checks.
-   Rate-limiting recommended on auth and webhook endpoints.
-   Validate webhook signatures before processing.
-   Store sensitive configs in environment variables and do not commit to repo.

---

## 12. Error Format

All errors follow this shape:

```json
{
    "status": "error",
    "message": "Descriptive message",
    "errors": [
        /* optional field errors */
    ]
}
```

---

If you want, I can:

-   Add exact request/response examples for each analytics endpoint,
-   Export a Postman/OpenAPI stub for the updated spec,
-   Add environment variable names and example `.env` file.
