# Document Upload Backend

This repository contains the backend services for the  document upload with role managemnet. There is three roles admin, editor and viewer. Admin can assign role to users. Admin and Editor can upload documents. Viewer can view only it.

- [Architecture Overview](#architecture-overview)

- [Services](#services)
  - [API Gateway](#api-gateway)
  - [Auth Service](#auth-service)
  - [User Service](#user-service)
  - [Document Service](#document-service)
- [Databases and Redis](#databases-and-redis)
  - [Redis](#redis)
  - [PostgreSQL](#postgresql)
- [Configuration Files](#configuration-files)
  - [Docker Compose](#docker-compose)
  - [PostgreSQL Configuration](#postgresql-configuration)
  - [Redis Configuration](#redis-configuration)
- [Running the Application](#running-the-application)
---

## Architecture Overview
![image](https://github.com/jhapankaj4u/jest-document/blob/master/docs.jpg)


The backend is structured into multiple services to promote scalability and maintainability:

- **API Gateway**: Manages incoming requests and routes them to the appropriate services.
- **Auth Service**: Handles user authentication and authorization.
- **User Service**: Manages role assignment.
- **Document Service**: Manages CURD opertation for Document.
These services communicate asynchronously, ensuring a decoupled and resilient system.

---


## Services

### API Gateway

Located in the `api-gateway` directory, this service serves as the entry point for clients. It routes requests to the appropriate backend services and handles concerns such as cros and rate limiting.

### Auth Service

Found in the `auth-microservice` directory, this service is responsible for user authentication and authorization. It manages user credentials and issues tokens for session management.

### User Service

Situated in the `user-microserice` directory, this service handles to assign roles to multiple users

### Document Service

Situated in the `document-microserices` directory, this service handles CURD operation for Document uploads

---

## Databases and Redis

### Redis

- Used for storing token for login/logout and blacklist token


### PostgreSQL

- Used for storing relational data to manage user and documents

---

## Configuration Files

### Docker Compose

The `docker-compose.yml` file orchestrates the various services and dependencies:

- **Services**:
  - `api-gateway`
  - `auth-service`
  - `user-service`
  - `document-service`

---

## Running the Application

To run the application locally:

1. Ensure Docker and Docker Compose are installed on your system.
2. Clone the repository:
   ```sh
   git clone git@github.com:jhapankaj4u/jest-document.git

3. Run DockerFile
4. copy env.sample to .env and update configurations
5. Run migration for DB  - npm run migrate && npm run seed
6. Import document_postman.json file from root into postman and test
6. Run docker.compose -d up


