import { Users } from '../model/Users.mjs';
import { getStockPrice } from '../utils/get-price.mjs';
import { getDb } from '../utils/db.mjs';
import cron from 'node-cron';
import { Game } from '../model/Games.mjs';


async function _get_games_collection() {
    let db = await getDb();
    return await db.collection('Games');
}

export async function create_game(req, res) {
    try {
        let playerName = req.body.name;
        let gameName = req.params.gameName;
        
        let player = await Users.get_player(playerName);
        let game =  await Game.get_gameName(gameName)
        
        if (player?.length > 0 && player[0].isHost && game.length == 0) {
            const newGame = new Game(gameName, playerName);
            
            newGame.save();

            res.status(200).send({
                success: true,
                message: `Game "${gameName}" created by Host name: ${newGame.hostName}`,
                newGame: newGame
            });
        } else {
            res.status(403).send({
                success: false,
                message: 'Only hosts can create games or game name already in use.'
            });
        }
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

export async function join_game(req, res) {
    try {
        let gameName = req.params.gameName;
        let playerName = req.body.name;

        // Check if the player is already in any game
        const gamesCollection = await _get_games_collection();
        const existingGame = await gamesCollection.findOne({ players: playerName });
        
        let userCollection = await Users.get_player(playerName);
    
        if (existingGame) {
            return res.status(300).send(`Player ${playerName} is already in game ${existingGame.gameName}.`);
        }
        if(userCollection[0].isHost){
            return res(301).send(`User ${playerName} is a host not a player.`);
        }
        // Retrieve the game using the provided gameCode
        const game = await gamesCollection.findOne({ gameName: gameName });

        if (!game) {
            return res.status(400).send(`Game with name ${gameName} not found.`);
        }

        // Add the player to the game
        await Game.addPlayer(gameName, playerName);

        

        res.status(200).send(`Player ${playerName} successfully joined game ${gameName}.`);
    } 
    catch (error) {
        console.error('Error joining game:', error);
        res.status(404).send('Failed to join the game.');
    }
}

export async function game_winner(req,res){
    let gameName = req.params.gameName;
    const gamesCollection = await _get_games_collection();
    let game = await gamesCollection.findOne({ gameName: gameName })
    if (!game) {
        res.status(404).send(`Game ${gameName} not found.`);
        return;
    }
    if (!game.players || game.players.length === 0) {
        res.status(404).send(`No players found in game ${gameName}.`);
        return;
    }
    let players = game.players;
    let highest = -1;
    let winner = '';
    for(let i = 0; i < players.length; i++ ){
        let playerTotal = await Users.player_total(players[i]);
        if (playerTotal>highest){
            highest = playerTotal;
            winner = players[i];
        }
    }
    
    if (winner) {
        res.status(200).send(`The winner of game ${gameName} is ${winner}.`);
    } else {
        res.status(404).send(`No winner found for game ${gameName}.`);
    }

}

