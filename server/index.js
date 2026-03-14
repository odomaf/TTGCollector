const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies - req.body

//ROUTES

//create a game
app.post ('/addGame', async (req, res) => {
  try {
    const { name, min_players, max_players, play_time } = req.body;
    const result = await pool.query(
      'INSERT INTO games (name, min_players, max_players, play_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, min_players, max_players, play_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to add game ${err.message}` });
  }
});


//get all games
app.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games'); 
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to retrieve games ${err.message}` });
  }
});

//get a game
app.get('/game/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Game not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to retrieve game ${err.message}` });
  }
});


//update a game
//FIX THIS - currently updates all fields, but should only update the fields that are provided in the request body
app.put('/updateGame/:id', async (req, res) => {
  try {
    const { id } = req.params;  
    const { name, min_players, max_players, play_time } = req.body;
    const result = await pool.query(
      'UPDATE games SET name = $1, min_players = $2, max_players = $3, play_time = $4 WHERE id = $5 RETURNING *',
      [name, min_players, max_players, play_time, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Game not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to update game ${err.message}` });
  }
});


//delete a game 
app.delete('/deleteGame/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Game not found' });
    } else {
      res.status(200).json({ message: 'Game deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to delete game ${err.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});