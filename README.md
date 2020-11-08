## Getting Started

### Requirements
* nodejs v12.18.0
* npm v6.14.8
* Docker

### First-time setup
```bash
# Install dependencies
npm install

# Start mongodb
npm run db:up

# Run the database seeding script to generate some mock data
npm run db:seed
```

### How do I run the application for local development?
```bash
# Start mongodb
npm run db:up

# Start dev server
npm run dev
```
Development page found at [http://localhost:3000](http://localhost:3000)

### How do I stop the database?
```bash
npm run db:down
```
