# RBAC-Project

Role-Based Access Control (RBAC) System
Overview
This project is a Role-Based Access Control (RBAC) implementation where users can register, log in, and access protected resources based on their assigned roles. Using JWT (JSON Web Tokens) for authentication, this system ensures that users only access what they’re permitted to.

Key Features
Secure User Registration & Login with JWT tokens.
Role Management (e.g., admin, user) for customized access control.
API Protection using role-based access for secure routes.
Password Security with bcrypt hashing.
Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT
Password Encryption: bcrypt

API Endpoints
POST /api/register – Register a new user.
POST /api/login – Login and get a JWT token.
GET /api/protected – Access protected resources (requires JWT).
