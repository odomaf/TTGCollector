# TTGCollector

A personal board game collection manager that helps you catalog your games quickly and decide what to play faster.

## Overview

TTGCollector is a full-stack PERN application for tracking tabletop games in your personal collection.  
You can add a game by name and pull details from BoardGameGeek, or manually enter full details when a title is not available.

Built as a solo project.

## Features

- Create a catalog of your board games by entering only the game name and pulling game information from BoardGameGeek.
- Manually add complete game details when a game is not available on BoardGameGeek.
- Quickly find what to play by filtering your collection by:
  - Player count
  - Duration
  - Player age
  - Game type (categories)
  - Game mechanics

## Tech Stack

### Frontend

- React
- Vite
- Bootstrap

### Backend

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- Express Session for authentication/session handling

### External Data

- BoardGameGeek data integration (through backend routes)

## Project Structure

TTGCollector/
client/ # React + Vite frontend
server/ # Express + Sequelize backend
package.json # root scripts/dependencies

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- PostgreSQL

### 1. Clone the repository

git clone https://github.com/odomaf/TTGCollector.git
cd TTGCollector

### 2. Install dependencies

Install from project root:

npm install

If your environment expects per-folder installs, also run:

cd client && npm install
cd ../server && npm install
cd ..

### 3. Configure environment variables

Create a .env file for the backend (typically in server/) with values like:

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
SESSION_SECRET=your_session_secret

Use your project’s existing environment expectations if they differ.

### 4. Set up the database

- Ensure PostgreSQL is running.
- Create the database that matches DB_NAME.
- Run schema setup from server/db/schema.sql.
- Run seeds if desired.

### 5. Run the application

Use the scripts in package.json:

npm run <script-name>

To list available scripts:

npm run

## Usage

1. Sign up or log in.
2. Add a game by name to search/import data from BoardGameGeek.
3. If no match is found, add the game manually.
4. Use filters to narrow your collection and choose a game quickly.

## Roadmap / Future Improvements

- Add a live deployed version
- Add more sorting options (playtime, player count, name, etc.)
- Add automated test coverage
- Add pagination/virtualization for very large collections

## Author

Solo project by Annetastic.

## License

This project is currently unlicensed for public reuse.  
Consider adding an MIT License (or your preferred license) if you plan to open source it.
