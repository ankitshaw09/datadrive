# My Drive - A Cloud Storage Application

This project is a full-stack web application for cloud storage, built using Django for the backend and React for the frontend. It allows users to create folders, upload files, and manage their digital content.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
  - [Backend (Django)](#backend-django)
  - [Frontend (React)](#frontend-react)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Drive (Folders & Files)](#drive-folders--files)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure registration, login, and logout for user accounts.
- **Folder Management:**
    - Create new folders.
    - View folder details.
    - Rename folders.
    - Move folders between directories.
    - Delete folders.
    - List contents of a specific folder.
    - List all top-level (parent) folders.
- **File Management:**
    - Upload files to specific folders.
    - View file details (name, upload time, etc.).
    - Download files.
    - Delete files.
- **Intuitive User Interface:** A responsive and user-friendly interface built with React.

## Technologies Used

**Backend (Django):**

- **Django:** A high-level Python web framework.
- **Django REST Framework:** A powerful and flexible toolkit for building Web APIs.
- **Django Simple JWT:** For handling JSON Web Token (JWT) based authentication.
- **(Potentially) Pillow:** For image processing (if implemented for thumbnails, etc.).
- **(Potentially) Database:** SQLite (for development), PostgreSQL, MySQL, etc.

**Frontend (React):**

- **React:** A JavaScript library for building user interfaces.
- **React Router:** For handling client-side routing.
- **Axios:** For making HTTP requests to the backend API.
- **(Potentially) Redux or Context API:** For state management.
- **(Potentially) Styled Components or CSS Modules:** For styling.
- **React Icons:** For using icons in the UI.

## Setup

Follow these steps to set up the project on your local machine.

### Backend (Django)

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <backend_directory>
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    venv\Scripts\activate  # On Windows
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Make migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Create a superuser (for admin access):**
    ```bash
    python manage.py createsuperuser
    ```

6.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend will be accessible at `http://127.0.0.1:8000/`.

### Frontend (React)

1.  **Navigate to the frontend directory:**
    ```bash
    cd <frontend_directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables (if any):**
    - Create a `.env` file based on `.env.example` (if provided) and configure API URLs, etc.

4.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The frontend will likely be accessible at `http://localhost:3000/`.

## API Endpoints

The backend provides the following API endpoints for the frontend to interact with. All API endpoints are prefixed with `/api/`.

### Authentication

- **`POST /api/accounts/register/`**: Register a new user.
    ```json
    {
      "email": "shawankit5@gmail.com",
      "name": "ankit shaw",
      "password": "123456ankit"
    }
    ```
    - **Response:** Returns user details upon successful registration.

- **`POST /api/accounts/login/`**: Log in an existing user.
    ```json
    {
      "email": "shawankit5@gmail.com",
      "password": "123456ankit"
    }
    ```
    - **Response:** Returns access and refresh tokens upon successful login.

- **`POST /api/accounts/logout/`**: Log out the current user (requires a valid refresh token in the request body).
    ```json
    {
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NjM1OTcwNSwiaWF0IjoxNzQ2MjczMzA1LCJqdGkiOiJlMDQwODg4MDljMGM0ZmY3OTBmZjUxMTUxYWMxY2FkMSIsInVzZXJfaWQiOjJ9.1td-t4SD4VNPkYwmWvVFURGLA1aVJa-AXG2cr-erG9E"
    }
    ```
    - **Response:** Returns a success message upon successful logout.

### Drive (Folders & Files)

- **`POST /api/drive/folders/create/`**: Create a new folder in the root directory (if `parent` is not provided) or within a specified parent folder.
    ```json
    {
      "name": "video",
      "parent": null // Optional: ID of the parent folder
    }
    ```
    - **Response:** Returns the details of the newly created folder.

- **`GET /api/drive/folders/<folder_id>/`**: Retrieve details of a specific folder.
    - **Path Parameter:** `folder_id` (integer) - The ID of the folder.
    - **Response:** Returns the folder's name, ID, parent ID, and creation timestamp.

- **`PATCH /api/drive/folders/<folder_id>/`**: Update the name or parent of a specific folder.
    ```json
    {
      "name": "updated name",
      "parent": 3 // Optional: ID of the new parent folder to move to
    }
    ```
    - **Path Parameter:** `folder_id` (integer) - The ID of the folder to update.
    - **Response:** Returns the updated folder details.

- **`DELETE /api/drive/folders/<folder_id>/`**: Delete a specific folder.
    - **Path Parameter:** `folder_id` (integer) - The ID of the folder to delete.
    - **Response:** Returns a success message upon successful deletion.

- **`GET /api/drive/folders/list/?parent=<parent_id>`**: List the contents (subfolders and files) of a specific folder.
    - **Query Parameter:** `parent` (integer, optional) - The ID of the parent folder. If not provided, lists contents of the root.
    - **Response:** Returns a list of subfolders and files within the specified folder.

- **`GET /api/drive/folders/parents/`**: List all top-level (parent) folders for the authenticated user.
    - **Response:** Returns a list of parent folders.

- **`POST /api/drive/files/upload/`**: Upload a new file to a specific folder.
    - **Request Type:** `multipart/form-data`
    - **Form Data:**
        - `file`: The file to be uploaded.
        - `folder`: The ID of the folder to upload the file to.
    - **Response:** Returns the details of the uploaded file.

- **`GET /api/drive/files/<file_id>/`**: Retrieve details of a specific file.
    - **Path Parameter:** `file_id` (integer) - The ID of the file.
    - **Response:** Returns the file's name, ID, upload time, size, and the file URL.

- **`PATCH /api/drive/files/<file_id>/`**: Update the details (e.g., name) of a specific file.
    - **Path Parameter:** `file_id` (integer) - The ID of the file to update.
    - **Request Body:**
        ```json
        {
          "name": "new_file_name.txt"
        }
        ```
    - **Response:** Returns the updated file details.

- **`DELETE /api/drive/files/<file_id>/`**: Delete a specific file.
    - **Path Parameter:** `file_id` (integer) - The ID of the file to delete.
    - **Response:** Returns a success message upon successful deletion.

## Running the Application

1.  Ensure both the backend (Django development server) and the frontend (React development server) are running concurrently.
    - Start the Django server from the backend directory using `python manage.py runserver`.
    - Start the React development server from the frontend directory using `npm start` or `yarn start`.

2.  Open your web browser and navigate to the address where the React frontend is running (usually `http://localhost:3000/`).

## Contributing

Contributions to this project are welcome. Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature` or `git checkout -b bugfix/your-fix`).
3.  Make your changes and commit them (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Create a new Pull Request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

[Specify the license under which your project is released (e.g., MIT License, Apache 2.0, etc.)]