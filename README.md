# COMP4021 Project

## Backend API Endpoints:

- /register

  Request Body:

  e.g. `{
  "username": "oscar",
  "name": "Oscar",
  "password": "pwd"
}`

  Response:

  1. Username is empty:
  
        `{ status: "error", error: "username is empty" }`

  2. Username contains special characters (using lab 5 regex):
  
        `{ status: "error", error: "username should contains only underscores, letters or numbers" }`

  3. Username already exists:
  
        `{ status: "error", error: "username already exists" }`

  4. Name is empty:
  
        `{ status: "error", error: "name is empty" }`

  5. Password is empty:
  
        `{ status: "error", error: "password is empty" }`

  6. Success:
  
        User will be added to `users.json`

        e.g. `{
            "oscar916": {
            "name": "oscar",
            "password": "$2b$10$5cwCDY3kPg9ZhuoIgRbPh.6lqoUQdK7QQK3owaIVcND/b3MVsQjWS"
            },
        }`
  
        `{ status: "success", message: "users has been created" }`

## Running the server:
`
1. Goto the root directory
2. Run 'npm install'
3. Run 'npm start'
`