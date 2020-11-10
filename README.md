## Getting Started

### Requirements
* nodejs v12.18.0
* npm v6.14.8
* Docker

### First-time setup
```bash
# Copy .env.example file to .env
cp .env.example .env

# Install dependencies
npm install

# Start mongodb
docker-compose up -d

# Run the database seeding script to generate some mock data
npm run db:seed
```

### How do I run the application for local development?
```bash
# Start mongodb
docker-compose up -d

# Start dev server
npm run dev

# ready - started server on http://localhost:3000
```
Per the seeding script found in this project, here are a few credentials that can be used to authenticate.
1. `dev@domain.com / qwe123`
2. `dev2@domain.com / qwe123`
3. `dev3@domain.com / qwe123`

### How do I stop the database?
```bash
npm run db:down
# Or
docker-compose down
```

### How do I run end to end tests?
```bash
# Start mongodb
docker-compose up -d

# Start dev server
npm run dev

# Run the tests
npm run test
```
E2E tests are set up to run "headful" (will explicitly open a chromium window) for demo purposes.