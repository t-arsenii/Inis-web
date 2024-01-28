import express from 'express';
import  gamesController  from "../controllers/gameStateController"
const router = express.Router();

router.get('/games/online', gamesController.GetOnlinePlayers)
router.get('/games', gamesController.GetGames);
router.get('/games/:id', gamesController.GetGame);
router.get('/games/format/:id', gamesController.GetGameFormated);
router.post('/games', gamesController.CreateGame)
router.post('/games/:id', gamesController.CreateGameWithId)

export default router;