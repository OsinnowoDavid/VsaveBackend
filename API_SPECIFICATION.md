# Vsave Backend API Specification

This document provides a comprehensive list of all exposed RESTful API endpoints for the Vsave Backend. This specification enables seamless integration for the frontend development team.

**Base URL (assumed):** `[Your Server Host]/api/v1`

## General Information

- **Authentication:** All protected routes require a JSON Web Token (JWT) sent in the **Authorization** header as a Bearer token: `Authorization: Bearer <token>`.
- **Request/Response Format:** All request bodies and successful responses are in **JSON** format.
- **Password Hashing:** Passwords are hashed using **Argon2** on the server.
- **User Types:** The system supports three main user types: **User**, **Regional Admin**, and **Super Admin**.

---

## 1\. User Endpoints (`/user`)

These endpoints are for general Vsave users, handling registration, login, email verification, and KYC stage 1 submission.

| Method   | Path                              | Description                                                            | Access          |
| :------- | :-------------------------------- | :--------------------------------------------------------------------- | :-------------- |
| **POST** | `/user/register`                  | Registers a new user account.                                          | Public          |
| **POST** | `/user/login`                     | Logs in a user and returns a JWT.                                      | Public          |
| **POST** | `/user/verify-email`              | Verifies a user's email using a token.                                 | Public          |
| **POST** | `/user/resend-verification-token` | Requests a new email verification token.                               | Public          |
| **GET**  | `/user/profile`                   | Retrieves the authenticated user's profile.                            | **Auth (User)** |
| **GET**  | `/user/get-all-banks`             | Retrieves a list of supported banks and their codes (via Flutterwave). | **Auth (User)** |
| **GET**  | `/user/register-kyc1`             | Submits the first stage of KYC information.                            | **Auth (User)** |

### 1.1. User Registration (`POST /user/register`)

| Parameter   | Location | Type   | Required | Description                                         |
| :---------- | :------- | :----- | :------- | :-------------------------------------------------- |
| `firstName` | Body     | string | Yes      | User's first name.                                  |
| `lastName`  | Body     | string | Yes      | User's last name.                                   |
| `email`     | Body     | string | Yes      | User's email address.                               |
| `password`  | Body     | string | Yes      | User's password (min 8 chars, secured with Argon2). |

**Success Response (200 OK):**

```json
{
    "status": "Success",
    "message": "User created successfully",
    "data": {
        "firstName": "...",
        "lastName": "...",
        "email": "...",
        "_id": "..." // User ID
    }
}
```

### 1.2. User Login (`POST /user/login`)

| Parameter  | Location | Type   | Required | Description           |
| :--------- | :------- | :----- | :------- | :-------------------- |
| `email`    | Body     | string | Yes      | User's email address. |
| `password` | Body     | string | Yes      | User's password.      |

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "login successfuly",
    "token": "..." // JWT to be used for protected routes
}
```

### 1.3. Verify Email (`POST /user/verify-email`)

| Parameter | Location | Type   | Required | Description                                             |
| :-------- | :------- | :----- | :------- | :------------------------------------------------------ |
| `email`   | Body     | string | Yes      | User's email address.                                   |
| `token`   | Body     | number | Yes      | The 6-digit verification code sent to the user's email. |

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "email verification successful"
}
```

### 1.4. Resend Verification Token (`POST /user/resend-verification-token`)

| Parameter | Location | Type   | Required | Description           |
| :-------- | :------- | :----- | :------- | :-------------------- |
| `email`   | Body     | string | Yes      | User's email address. |

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "verification token sent successfully"
}
```

### 1.5. Get User Profile (`GET /user/profile`)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "welcome back",
    "data": {
        "firstName": "...",
        "lastName": "...",
        "email": "...",
        "isEmailVerified": true,
        // ... other user details
        "kycStatus": "PENDING" // (Assumed field based on service logic)
    }
}
```

### 1.6. Get All Banks (`GET /user/get-all-banks`)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):** Returns a list of banks for Nigeria (`/v3/banks/NG` Flutterwave call).

```json
{
    "Status": "success",
    "message": "all banks",
    "data": [
        {
            "id": 1,
            "code": "044",
            "name": "Access Bank"
        }
        // ... list of banks
    ]
}
```

### 1.7. Register KYC Stage 1 (`GET /user/register-kyc1`)

**Note:** The route is a `GET` in the route file but the controller expects a `req.body`, suggesting it should probably be a **POST** request. **Assuming POST for data submission.**

**Headers:** `Authorization: Bearer <token>`

| Parameter        | Location | Type   | Required | Description                                     |
| :--------------- | :------- | :----- | :------- | :---------------------------------------------- |
| `profession`     | Body     | string | Yes      | User's profession.                              |
| `accountNumber`  | Body     | number | Yes      | User's bank account number.                     |
| `bank`           | Body     | string | Yes      | User's bank name.                               |
| `bankCode`       | Body     | string | Yes      | User's bank code (from `/get-all-banks`).       |
| `accountDetails` | Body     | string | Yes      | Account name (likely for validation reference). |
| `country`        | Body     | string | Yes      | User's country.                                 |
| `state`          | Body     | string | Yes      | User's state/region.                            |
| `bvn`            | Body     | string | Yes      | User's Bank Verification Number.                |

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "KYC 1 created successfully",
    "data": {
        "profession": "...",
        "accountNumber": "..."
        // ... other KYC 1 details
    }
}
```

---

## 2\. Super Admin Endpoints (`/admin`)

These endpoints are for the Super Admin, including initial registration and authentication.

| Method   | Path              | Description                                          | Access                 |
| :------- | :---------------- | :--------------------------------------------------- | :--------------------- |
| **POST** | `/admin/register` | Registers the Super Admin (likely a one-time setup). | Public                 |
| **POST** | `/admin/login`    | Logs in the Super Admin and returns a JWT.           | Public                 |
| **GET**  | `/admin/profile`  | Retrieves the authenticated Super Admin's profile.   | **Auth (Super Admin)** |

### 2.1. Super Admin Registration (`POST /admin/register`)

| Parameter     | Location | Type   | Required | Description                  |
| :------------ | :------- | :----- | :------- | :--------------------------- |
| `fullName`    | Body     | string | Yes      | Super Admin's full name.     |
| `email`       | Body     | string | Yes      | Super Admin's email address. |
| `phoneNumber` | Body     | string | Yes      | Super Admin's phone number.  |
| `password`    | Body     | string | Yes      | Super Admin's password.      |

**Success Response (200 OK):**

```json
{
    "status": "Success",
    "message": "Super admin created successfully",
    "data": {
        "fullName": "...",
        "email": "..."
        // ... other Super Admin details
    }
}
```

### 2.2. Super Admin Login (`POST /admin/login`)

| Parameter  | Location | Type   | Required | Description                  |
| :--------- | :------- | :----- | :------- | :--------------------------- |
| `email`    | Body     | string | Yes      | Super Admin's email address. |
| `password` | Body     | string | Yes      | Super Admin's password.      |

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "Login successful",
    "token": "..." // JWT to be used for protected routes
}
```

### 2.3. Super Admin Profile (`GET /admin/profile`)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "welcome back",
    "data": {
        "fullName": "...",
        "email": "...",
        "type": "superadmin"
        // ... other Super Admin details
    }
}
```

---

## 3\. Regional Admin Endpoints (`/regional-admin`)

These endpoints are for Regional Administrators.

| Method   | Path                      | Description                                           | Access                    |
| :------- | :------------------------ | :---------------------------------------------------- | :------------------------ |
| **POST** | `/regional-admin/login`   | Logs in a Regional Admin and returns a JWT.           | Public                    |
| **GET**  | `/regional-admin/profile` | Retrieves the authenticated Regional Admin's profile. | **Auth (Regional Admin)** |

### 3.1. Regional Admin Login (`POST /regional-admin/login`)

| Parameter  | Location | Type   | Required | Description                     |
| :--------- | :------- | :----- | :------- | :------------------------------ |
| `email`    | Body     | string | Yes      | Regional Admin's email address. |
| `password` | Body     | string | Yes      | Regional Admin's password.      |

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "login successfuly",
    "token": "..." // JWT to be used for protected routes
}
```

### 3.2. Regional Admin Profile (`GET /regional-admin/profile`)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
    "Status": "success",
    "message": "welcome back",
    "data": {
        "fullName": "...",
        "email": "...",
        "region": "..."
        // ... other Regional Admin details
    }
}
```
