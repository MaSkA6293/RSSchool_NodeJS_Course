# CRUD API

## Description

Simple CRUD API with in-memory database.

## Technical requirements

- Use 18 LTS version of Node.js

## Install

1. Install Node.js
2. Clone this repository
3. Switch branch <code>CRUD-api</code>
4. To install all dependencies use <code>npm install</code>

## Run the APP

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run start:prod
```

Development mode with a load balancer:

```bash
npm run start:multi-dev
```

Production mode with a load balancer:

```bash
npm run start start:multi
```

Run tests:

```bash
npm run test
```

Scenario test are placed in:

```
 "./src/router/router-scenario.test.ts"
```

Run ESlint

```bash
npm run lint
```

## API

Endpoint: **api/users**

GET <code>api/users</code> - to get all users records

GET <code>api/users/${userId}</code> - to get user by Id

POST <code>api/users</code> - to create record about new user and store it in database

PUT <code>api/users/${userId}</code> - to update existing user

DELETE <code>api/users/${userID}</code> - to delete existing user from database

Interface User:

- `id` — unique identifier (`string`, `uuid`) generated on server side
- `username` — user's name (`string`, **required**)
- `age` — user's age (`number`, **required**)
- `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
