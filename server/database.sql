CREATE DATABASE ttgcollector_DEV;

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    play_time INTEGER NOT NULL
);