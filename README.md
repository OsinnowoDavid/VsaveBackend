# Vsave Backend

## Overview

This is the robust backend for the Vsave digital savings and wallet platform. It is a critical part of the system's architecture, handling all core business logic, from user management and security to payment processing and financial reporting.

## Features

-   **Authentication & Security:** Manages user authentication securely using `jsonwebtoken` and `argon2` for password hashing.
-   **API Endpoints:** Provides a comprehensive set of API endpoints for managing users, savings, wallets, and bonus transfers.
-   **MongoDB Integration:** Persists all application data in a NoSQL database via `Mongoose` for flexible and efficient data management.
-   **RESTful Architecture:** Built with `Express.js` to provide a clean and scalable REST API.
-   **TypeScript:** Utilizes TypeScript to ensure type safety and improve code maintainability across the backend.

## Technology Stack

This project is built using the following technologies:

-   **Node.js:** The JavaScript runtime environment for building the server.
-   **Express.js:** A fast and minimalist web framework for handling API routes and requests.
-   **MongoDB:** The NoSQL database for storing all application data.
-   **Mongoose:** An elegant Object Data Modeling (ODM) library for MongoDB.
-   **TypeScript:** For static typing to improve code quality.
-   **jsonwebtoken:** For creating and verifying JSON Web Tokens for authentication.
-   **argon2:** A powerful and secure hashing library for passwords.

## Getting Started

Follow these steps to set up and run the Vsave backend locally for development.

### Prerequisites

-   **Node.js** (LTS version recommended)
-   **npm** (Node Package Manager)
-   **MongoDB** (running locally or accessible via a cloud service)

### Setup

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/OsinnowoDavid/VsaveBackend.git
    cd VsaveBackend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the root directory. Add your MongoDB connection string and a secret for JWT as shown in the example below.

    ```
    MONGODB_URI=mongodb://localhost:27017/vsave_db
    JWT_SECRET=your_super_secret_key
    ```

    _(Remember to replace `your_super_secret_key` with a long, random string.)_

4.  **Start the Backend Server:**

    You can run the server in development mode with `ts-node`, which watches for file changes and restarts automatically.

    ```bash
    npm run start:dev
    ```

    The server will start and listen on the configured port, typically `3000`. You're now ready to use this backend with your frontend or test it with an API client like Postman.

### User Endpoints

### 1. Create User Account

```http
POST /api/client/createclient
```
