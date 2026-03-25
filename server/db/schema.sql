DROP DATABASE IF EXISTS ttgcollector_DEV;
CREATE DATABASE ttgcollector_DEV;

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    thumbnail TEXT,
    description TEXT,
    published TEXT,
    bgg_id INTEGER UNIQUE,
    minplaytime INTEGER,
    maxplaytime INTEGER,
    minage INTEGER,
);

CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category TEXT NOT NULL UNIQUE
);

CREATE TABLE mechanics (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mechanic TEXT NOT NULL UNIQUE
);

CREATE TABLE game_categories (
    game_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (game_id, category_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE game_mechanics (
    game_id INTEGER NOT NULL,
    mechanic_id INTEGER NOT NULL,
    PRIMARY KEY (game_id, mechanic_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_games (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);