# B4F Hub

B4F Hub is a React and TypeScript app for B4F trainees and alumni. It brings a community feed and career opportunities together in one place, backed by a local Express API with seeded data.

## Features

- Browse, search, and filter community posts by category.
- Create posts and like or unlike existing posts.
- Browse opportunities, search by title, company, or skill, and filter by type and work mode.
- Save opportunities during your current session, view their details, and apply.
- Navigate back through previously opened opportunity details.

## Requirements

- Node.js
- npm

## Getting started

Install dependencies:
```bash
npm install
```

### Start the Vite client and Express API together
```bash
npm run dev
```

Vite prints the client URL in the terminal. The API listens on http://localhost:3003, and Vite proxies /api requests to it. Keep the development process running while using the app.

To run the services separately, use two terminals:
```bash
npm run dev:server

npm run dev:client
```
## Available scripts
Command	                Description
npm run dev	            Start the client and API together
npm run dev:client	    Start the Vite development server
npm run dev:server	    Start the Express API
npm run build	          Type-check and build the production client
npm run lint	          Run ESLint
npm run preview	        Preview the production build

## Data behavior
The API starts with deterministic seed data. New posts, likes, and application updates are held in server memory and reset when the API restarts. Saved opportunities are held in client-side state and reset when the page is refreshed