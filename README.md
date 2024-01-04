# Gobots Chat App

This repository contains the source code for the Gobots Chat App, a React application for chatting with emoji support. Below are instructions on how to run the code and a brief summary of the libraries used.

## How to Run the Code

### Prerequisites
- Docker

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/hgalvao98/gobots-chat.git
    cd gobots-chat
    ```

2. Build the Docker image:
    ```bash
    docker-compose build
    ```

3. Run the Docker container:
    ```bash
    docker-compose up -d
    ```

4. Access the application in your browser at [http://localhost:8080](http://localhost:8080).

To stop the application, run:
```bash
docker-compose down
```

## Libraries Used

- **@emoji-mart/data:** Emoji data library for emoji support.
- **@emoji-mart/react:** React components for rendering emojis.
- **@emotion/react and @emotion/styled:** CSS-in-JS libraries for styling React components.
- **@mui/icons-material and @mui/material:** Material-UI icons and components.
- **@reduxjs/toolkit:** Toolkit for efficient Redux development.
- **@tanstack/react-query:** React library for managing, caching, and synchronizing asynchronous data.
- **axios:** HTTP client for making API requests.
- **emoji-mart:** Emoji picker for React applications.
- **react and react-dom:** Core React libraries.
- **react-redux:** Official Redux bindings for React.
- **react-router-dom:** DOM bindings for React Router for declarative routing.
- **react-scripts:** Configuration and scripts for Create React App.
- **redux:** Predictable state container for JavaScript apps.
- **typescript:** A superset of JavaScript that adds static types.
- **uuid:** Library for generating UUIDs.
- **web-vitals:** Library for measuring web performance.

## Scripts

- **start:** Run the development server.
- **build:** Build the production-ready application.
- **test:** Run tests.
- **eject:** Eject from Create React App configuration.

## Development Environment

- **eslintConfig:** ESLint configuration extending React App and Jest configurations.
- **browserslist:** Target browsers for production and development environments.

