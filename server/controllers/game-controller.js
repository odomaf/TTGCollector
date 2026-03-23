const {game} = require('../models');

module.exports = {
  
  //POST /addGame
  async addGame({ body }, res) {
    const transaction = await sequelize.transaction();
    try {
      const game = await Game.create({
        game_name: body.game_name,
        min_players: body.min_players,
        max_players: body.max_players,
        play_time: body.play_time
      }, { transaction: transaction });
      await transaction.commit();
      res.status(201).json(game);
      console.log(`Game added: ${game.game_name}`);
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      res.status(500).json({ error: `Failed to add game ${err.message}, rolling back transaction` });
    }
  },

  //get all games
  async getGames(req, res) {
    try {
      const games = await Game.findAll();
      res.status(200).json(games);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `Failed to retrieve games ${err.message}` });
    }
  }

};

//   //get a game
//   app.get("/game/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
//       if (result.rows.length === 0) {
//         res.status(404).json({ error: "Game not found" });
//       } else {
//         res.status(200).json(result.rows[0]);
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: `Failed to retrieve game ${err.message}` });
//     }
//   });

//   //update a game
//   //FIX THIS - currently updates all fields, but should only update the fields that are provided in the request body
//   app.put("/updateGame/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { name, min_players, max_players, play_time } = req.body;
//       const result = await pool.query(
//         "UPDATE games SET name = $1, min_players = $2, max_players = $3, play_time = $4 WHERE id = $5 RETURNING *",
//         [name, min_players, max_players, play_time, id],
//       );
//       if (result.rows.length === 0) {
//         res.status(404).json({ error: "Game not found" });
//       } else {
//         res.status(200).json(result.rows[0]);
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: `Failed to update game ${err.message}` });
//     }
//   });

//   //delete a game
//   app.delete("/deleteGame/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const result = await pool.query(
//         "DELETE FROM games WHERE id = $1 RETURNING *",
//         [id],
//       );
//       if (result.rows.length === 0) {
//         res.status(404).json({ error: "Game not found" });
//       } else {
//         res.status(200).json({ message: "Game deleted successfully" });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: `Failed to delete game ${err.message}` });
//     }
//   });
// }
