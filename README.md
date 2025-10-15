# Vsave Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains the backend source code for the Vsave application, a fintech platform providing user management, KYC verification, virtual account creation, and value-added services like airtime and data purchases.

## Features

- **User Management**: Secure user registration (with `firstName`, `lastName`, `email`, `gender`, `dateOfBirth`, `phoneNumber`) and authentication using JWT.
- **Email Verification**: Token-based email verification flow.
- **KYC (Know Your Customer)**: A structured process for user identity verification, including BVN and bank account details.
- **Virtual Account Creation**: Dynamically creates virtual bank accounts for users via SquadCo for payments.
- **Value-Added Services (VAS)**:
  - Purchase airtime and data bundles.
  - Fetch available data plans per network.
  - Powered by SquadCo and Flutterwave integrations.
- **Secure & Modern Stack**: Built with TypeScript, Express, and MongoDB, with secure password hashing using Argon2.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Argon2
- **External APIs**:
  - SquadCo: For virtual accounts and vending services (airtime/data).
  - Flutterwave: For bank list retrieval and account verification.
- **Linting**: ESLint (assumed from `CONTRIBUTING.md`)

---

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

- Node.js (v18.x or later recommended)
- `npm` or `yarn`
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/VsaveBackend.git
    cd VsaveBackend
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root of the project. You can copy the `.env.example` if one exists. Fill it with the necessary values:

    ```env
    # Server Configuration
    PORT=5000

    # MongoDB Connection
    MONGO_URI=mongodb://localhost:27017/vsave

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=1d

    # Email Service (e.g., Nodemailer with SendGrid/Mailgun)
    EMAIL_HOST=
    EMAIL_PORT=
    EMAIL_USER=
    EMAIL_PASS=
    EMAIL_FROM="Vsave <no-reply@vsave.app>"

    # SquadCo API Keys
    SQUAD_SECRET_KEY=

    # Flutterwave API Keys
    FLW_SECRET_KEY=
    ```

### Running the Application

The `package.json` is configured to use `ts-node` for development.

- **Development Mode (with auto-reloading):**

    ```sh
    npm run dev
    ```

- **Production Mode:**
    First, build the TypeScript code:

    ```sh
    npm run build
    ```

    Then, run the compiled JavaScript:

    ```sh
    npm start
    ```

## API Documentation

For detailed information about the available API endpoints, request payloads, and response formats, please see the API_SPECIFICATION.md file.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please read our CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the `package.json` file for details.
