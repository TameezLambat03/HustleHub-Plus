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

Create a `.env` file in the **root directory** of the project.

The environment file should contain the required configuration, including the MongoDB connection string and HTTPS settings.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your-development-secret
USE_HTTPS=true
SSL_KEY_PATH=./server.key
SSL_CERT_PATH=./server.crt
```

Replace the placeholder values with the appropriate project configuration.

The `.env` file contains environment-specific configuration and should be kept secure.

## 4. HTTPS Certificate

HustleHub+ runs locally over HTTPS using an SSL certificate.

The project uses:

```text
server.crt
server.key
```

in the project root.

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

Open a terminal in the **project root directory** and run:

```powershell
npm start
```

The backend API should start on:

```text
https://localhost:5000
```

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

```text
http://localhost:5173
```

Open this address in a browser to use the HustleHub+ application.

### Running Both Parts

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

```text
https://localhost:5000
```

## 7. Main Application Features

HustleHub+ provides separate functionality for clients and freelancers.

### Clients

Clients can:

- Register and log in as a client
- Browse available freelance services
- View individual service details
- Book services
- Receive a simulated booking/payment confirmation
- View their bookings

### Freelancers

Freelancers can:

- Register and log in as a freelancer
- Create services
- View their own services
- Edit their services
- Delete their services
- View service details
- View their bookings
- View their total earnings
- View their freelancer dashboard

### Authentication

The application uses JWT-based authentication for protected API operations. User roles are used to control access to client and freelancer functionality.

## 8. API Testing

The backend API can be tested using Postman.

The authentication endpoints include:

```text
POST https://localhost:5000/api/auth/register
POST https://localhost:5000/api/auth/login
GET  https://localhost:5000/api/auth/me
```

Additional endpoints are available for:

```text
/api/gigs
/api/bookings
/api/transactions
```

Protected endpoints require a valid JWT Bearer token.

## 9. Seeded Admin Account

An administrator account is available for testing administrative functionality.

The following credentials can be used where required:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hustlehub.com` | `AdminPassword123!` |

This account is intended for development and testing purposes.

## Important Notes

The following files contain sensitive or environment-specific information and should be handled securely:

```text
.env
server.key
```

The MongoDB connection string should not be exposed outside the intended project members or assessment staff.

The SSL certificate (`server.crt`) may be shared as part of the local HTTPS setup, but the private key (`server.key`) should be treated as sensitive.

If a browser displays a warning when accessing the local HTTPS server, this may be caused by the use of a self-signed development certificate.