import express from 'express';
import  gamesController  from "../controllers/gameStateController"
const router = express.Router();

router.get('/games', gamesController.GetGame);
router.post('/games', gamesController.CreateGame)
router.post('/games/:id', gamesController.CreateGameWithId)

export default router;