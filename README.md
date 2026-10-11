# insy7314-2026-insy7314-poe-classroom-tameezlambat

# Group Members

Cuan Oock - ST10439216  
Tameez Lambaat - ST10462078  
Atlegang GAMEDE – ST10445041  
Titus Ndaba - ST10448883  

# Updated Youtube demo video

[https://youtu.be/iELxDHfDBEo?si=W6eOj3fZwreM4FTM](https://youtu.be/iELxDHfDBEo?si=W6eOj3fZwreM4FTM)

# Project Overview

HustleHub+ is a web application designed to connect freelancers with clients through a centralised platform for advertising and discovering freelance services.

The application consists of a React frontend and a Node.js/Express backend API, with MongoDB used for data storage. The system supports three user roles: clients, freelancers, and administrators. Clients can browse available services and access booking functionality, freelancers can create and manage their gigs, and administrators have a dedicated role for administrative functionality within the system.

Users can register as clients or freelancers and authenticate securely to access functionality according to their assigned roles. Administrator accounts cannot be created through public registration, helping prevent unauthorised users from granting themselves administrative privileges.

Security is a key consideration in the application. HustleHub+ uses bcrypt for password hashing, JSON Web Tokens (JWT) for authentication, role-based access control, input validation, protected API routes, and HTTPS support. Gig management also incorporates ownership checks intended to prevent freelancers from modifying or deleting services belonging to other users.

# Technology Choices

Authentication and Authorisation

HustleHub+ uses JWT-based authentication to identify authenticated users when they access protected API endpoints. Tokens contain the user's identifier and role and are signed using a secret configured through environment variables.

Role-based access control restricts functionality according to the user's assigned role. Public registration supports client and freelancer accounts, while administrator accounts cannot be created through the public registration endpoint.

Password and Input Validation

Passwords are hashed using bcrypt before being stored in MongoDB. Registration and login requests are processed through validation middleware to check submitted data before the corresponding controller executes. Gig creation and update requests also use validation rules for fields such as title, description, category and price.

Validation failures return an HTTP 400 response with details of the rejected fields. Duplicate email addresses are rejected during registration, and login failures return a generic invalid-credentials message.

Gig Ownership Protection

Gig management endpoints use authentication and authorisation middleware. Ownership checks are intended to ensure that a freelancer can modify or delete only their own gigs. Requests involving gigs that the authenticated freelancer does not own should be rejected rather than allowing unauthorised changes.

API Protection and HTTPS

The backend includes security middleware and rate limiting to help reduce common API risks, including excessive authentication attempts. HTTPS can be enabled through environment configuration so that communication between the browser and backend is encrypted during local development.

Environment variables, database credentials, JWT secrets and private SSL keys must be kept out of public repositories. The actual configuration should be supplied through a local .env file or the deployment environment.

## Password Encryption

This part of the project focuses specifically on user account creation and login in a secure way. For this password security is extremely important. For passwords stored in a database, it is never good practice to store it in plain text, and it is industry standard to store passwords only if they've been through an algorithm that allows for one way hashing. This means that the password is hashed in such a manner that it cannot be reversed back into the original password (Ciampa, 2022).

For this, bcrypt is used. This is an algorithm that allows for one way hashing and allows for multiple iterations of the algorithm to run over the password for added layers of security (GeeksforGeeks, 2024). This allows for protection against brute force attacks as the algorithm is designed to be computationally heavy, meaning hackers will waste a lot of time and computing power trying to brute force multiple password attempts.

It also protects against rainbow table attacks, whereby a hacker will have passwords in plain text with possible hashes, as bcrypt automatically adds a random salt to each password that is unique (GeeksforGeeks, 2024). This ultimately results in a secure environment for passwords wherein even if the hashed password is obtained, user data will remain uncompromised.

## JWT

This backend server also makes use of JWT tokens. This allows for secure authentication when users interact with protected resources. For this system specifically, once a user role is authorised, the user will be assigned a JWT token, which is attached to the header of authenticated HTTPS requests through the application frontend (GeeksforGeeks, 2019).

This means that, without the server needing to store excess session data, the end user can have their authentication information and role used to access protected functionality while interacting with the system.

## SSL certificate

Finally, this backend server is configured to work with HTTPS using an SSL certificate. This means that the connection is encrypted between the server and a connecting client browser (Serpanos and Wolf, 2011).

It works by the server having an SSL certificate with a public key. A client browser can use this to establish an encrypted connection, meaning that data transmitted between the client and server is protected from being read by unauthorised parties (White and West, 2023).

# How to Run HustleHub+

Follow these steps to set up and run the HustleHub+ application locally.

## 1. Clone the Repository

Clone the repository and open the project folder in a terminal.

## 2. Install Backend Dependencies

From the project root, run:

```powershell
npm install
```

This installs the required Node.js dependencies listed in `package.json`.

## 3. Configure Environment Variables

Create a file named `.env` in the root directory of the project.

The environment file should contain the required configuration, including the MongoDB connection string and HTTPS settings, aswell as the admin details to be seeded on running the app.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your-development-secret
USE_HTTPS=true
SSL_KEY_PATH=./server.key
SSL_CERT_PATH=./server.crt
ADMIN_NAME=HustleHub Admin
ADMIN_EMAIL=admin@hustlehub.com
ADMIN_PASSWORD=AdminLogin12345_!
```

Replace the placeholder values with the appropriate project configuration. 

The `.env` file contains environment-specific configuration and should be kept secure.

## 4. HTTPS Certificate

HustleHub+ runs locally over HTTPS using an SSL certificate.

The project uses the following certificate files in the project root:

```text
server.crt
server.key
```

If the certificates have not been provided with the project, they can be generated locally using OpenSSL.

Check that OpenSSL is installed:

```powershell
openssl version
```

Generate a local certificate and private key:

```powershell
openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -sha256 -days 365 -nodes
```

When prompted for the certificate information, use:

```text
Common Name (e.g. server FQDN or YOUR name) []: localhost
```

The remaining fields can be left blank or completed as required.

This creates:

```text
server.crt
server.key
```

## 5. Start the Backend

Open a terminal in the project root directory and run:

```powershell
npm start
```

The backend API should start on:

[https://localhost:5000](https://localhost:5000)

A successful startup should display messages similar to:

```text
MongoDB connected successfully
HustleHub+ API running on https://localhost:5000
```

Keep this terminal running.

## 6. Start the React Frontend

Open a **second terminal** while leaving the backend terminal running.

Navigate into the frontend directory:

```powershell
cd frontend
```

Then start the React development server:

```powershell
npm run dev
```

The frontend should be available at:

[http://localhost:5173](http://localhost:5173)

Open this address in a browser to use the HustleHub+ application.

## Running Both Parts

The application requires both the backend and frontend to be running simultaneously.

**Terminal 1 — Backend:**

```powershell
npm start
```

**Terminal 2 — Frontend:**

```powershell
cd frontend
npm run dev
```

The frontend communicates with the backend API through:

[https://localhost:5000](https://localhost:5000)

## 7. Main Application Features

### Client

Clients can:

- Register and log in as a client
- Browse available freelance services
- View individual service details
- Book services
- Receive simulated booking and payment confirmations
- View their bookings
- View previously booked services

### Freelancer

Freelancers can:

- Register and log in as a freelancer
- Create freelance gigs and advertise their services
- View their own gigs
- Edit existing gigs
- Delete their own gigs
- View individual gig details
- View bookings made for their services
- View total earnings
- Access their freelancer dashboard

### Administrator

Administrators can:

- Log in using an administrator account
- View existing accounts
- Use the administrator account provided for local development and testing

Administrator accounts cannot be created through public registration.

### Security and Validation

The application includes the following security features:

- Password hashing using bcrypt
- JWT-based authentication for protected endpoints
- Role-based access control for clients, freelancers and administrators
- Input validation for registration, login and gig management
- Error handling for invalid requests and authentication failures
- Ownership checks intended to prevent freelancers from modifying or deleting gigs belonging to other freelancers
- HTTPS support for encrypted communication between the frontend and backend

## 8. Test the API

The API can be tested using Postman.

The main authentication endpoints are:

```text
POST https://localhost:5000/api/auth/register
POST https://localhost:5000/api/auth/login
GET  https://localhost:5000/api/auth/me
```

The gig, booking and transaction endpoints are available through:

```text
/api/gigs
/api/bookings
/api/transactions
```

Protected endpoints require a valid JWT Bearer token.

## 9. Seeded Admin Account

An administrator account can be seeded for testing. Public registration does not allow users to create an administrator account.

The following credentials can be used for testing:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hustlehub.com` | `AdminPassword123!` |

This account is intended for local development and testing.

## Important Notes

The following files contain environment-specific configuration or security credentials:

```text
.env
server.key
server.crt
```

These files should be handled securely and should not be exposed outside the intended project members and assessment staff.

The MongoDB connection string should be kept secure and only provided to authorised members of the project and the relevant assessment staff.

# Diagrams

### Architecture

![Architecture Diagram](screenshots/Architecture-diagram.png)

### Flow Diagram

![Flow Diagram](screenshots/Flow-Diagram.png)

## Screenshots of Postman Testing

### Registration

#### Register - Valid Client

![Register - Valid Client](screenshots/register-client.png)

#### Register - Valid Freelancer

![Register - Valid Freelancer](screenshots/register-freelancer.png)

#### Register - Duplicate User

![Register - Duplicate User](screenshots/register-duplicate.png)

#### Register - Missing Fields

![Register - Missing Fields](screenshots/register-missing-fields.png)

#### Register - Invalid Email

![Register - Invalid Email](screenshots/register-invalid-email.png)

#### Register - Weak Password

![Register - Weak Password](screenshots/register-weak-password.png)

#### Register - Admin Attempt

![Register - Admin Attempt](screenshots/register-admin-attempt.png)

### Login

#### Login - Client - Valid

![Login - Client - Valid](screenshots/login-client.png)

#### Login - Freelancer - Valid

![Login - Freelancer - Valid](screenshots/login-freelancer.png)

#### Login - Admin - Valid

![Login - Admin - Valid](screenshots/login-admin.png)

#### Login - Wrong Password

![Login - Wrong Password](screenshots/login-wrong-password.png)

#### Login - Invalid Email

![Login - Invalid Email](screenshots/login-invalid-email.png)

#### Login - Missing Fields

![Login - Missing Fields](screenshots/login-missing-fields.png)

### JWT

#### JWT - No Token

![JWT - No Token](screenshots/jwt-no-token.png)

#### JWT - Valid Token

![JWT - Valid Token](screenshots/jwt-valid-token.png)

#### JWT - Invalid Token

![JWT - Invalid Token](screenshots/jwt-invalid-token.png)

### HTTPS

#### HTTPS - Health Check

![HTTPS - Health Check](screenshots/https-health-check.png)

### Error Handling

#### Invalid JSON

![Invalid JSON](screenshots/error-invalid-json.png)

#### Missing Content

![Missing Content](screenshots/error-missing-content.png)

#### Protected Route - Invalid Token

![Protected Route - Invalid Token](screenshots/error-invalid-token.png)

# Seperation of Work

| Name | Responsibilities |
|---|---|
| Tameez Lambaat | Endpoint setup, Password encryption, Error handling |
| Atlegang Gamede | JWT token setup, Error debugging |
| Cuan Oock | Documentation and Diagrams |
| Titus Ndaba | User Input Validation, SSL certification |

# References

The IIE, 2025. Information Systems 3D, INSY7314 MODULE MANUAL, The Independent Institute of Education: Unpublished.

GeeksforGeeks (2024). NPM bcrypt. [online] GeeksforGeeks. Available at: [https://www.geeksforgeeks.org/node-js/npm-bcrypt/](https://www.geeksforgeeks.org/node-js/npm-bcrypt/) [Accessed 5 Sept. 2026].

GeeksforGeeks (2019). JSON Web Token (JWT). [online] GeeksforGeeks. Available at: [https://www.geeksforgeeks.org/web-tech/json-web-token-jwt/](https://www.geeksforgeeks.org/web-tech/json-web-token-jwt/) [Accessed 5 Sept. 2026].

Ciampa, M. Security+ Guide to Network Security Fundamentals. 2022. 7th ed. Cengage: Boston.

Serpanos, D. & Wolf, T. Architecture of Network Systems. 2011. Burlington: Elsevier.

White, C.M. & West, J. Data Communications & Computer Networks: A Business User’s Approach. 9th Edition. 2023. Cengage Learning: Boston.