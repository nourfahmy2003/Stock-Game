import { Users } from '../model/Users.mjs';
import { getStockPrice } from '../utils/get-price.mjs';
import { getDb } from '../utils/db.mjs';
import cron from 'node-cron';
import { Game } from '../model/Games.mjs';
import { getusername } from './user.mjs';



export async function _get_games_collection() {
    let db = await getDb();
    return await db.collection('Games');
}
async function _get_user_collection() {
    console.log('Getting the database connection...');
    let db = await getDb();
   

    if (db) {
        console.log('Database connection successful.');
        return await db.collection('Users');
    } else {
        console.error('Failed to get a valid database connection.');
        return null; // or handle the error appropriately
    }
}
const Name = await getusername; 
export async function create_game(req, res) {
    try {
        if (req.session.userid == null){
            req.session.userid = Name
        }
        let playerName = req.session.userid;
        let gameName = req.params.gameName;
        let player = await Users.get_player(playerName);
        let game =  await Game.get_gameName(gameName)
        console.log(playerName)
        if (player?.length > 0 && player[0].isHost && game.length == 0 && player[0].cur_game == null) {
            const newGame = new Game(gameName, playerName);
            
            newGame.save();
            await Users.update_cur_game(playerName, gameName);
            res.status(200).json({
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
        if (req.session.userid == null){
            req.session.userid = Name
        }
        let gameName = req.params.gameName;
        let playerName = req.session.userid;

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
        await Users.update_cur_game(playerName, gameName);
        

        res.status(200).send(`Player ${playerName} successfully joined game ${gameName}.`);
    } 
    catch (error) {
        console.error('Error joining game:', error);
        res.status(404).send('Failed to join the game.');
    }
}

export async function players_list(req, res) {
    try {
        // Get the current user's name
        
        const playerName = await getusername(); 
        // Get the current user's current game
        const user = await Users.get_player(playerName);
        const curGame = user[0].cur_game;
        // Check if the current user is in a game
        if (!curGame) {
            return res.status(404).send(`User ${playerName} is not in a game.`);
        }

        // Get the players in the current game
        const players = await Game.player_list(curGame);
        
        // Send the list of players as the response 
        res.status(200).send(players);
    } catch (error) {
        console.error('Error getting players list:', error);
        res.status(500).send('Internal Server Error');
    }
}


export async function game_winner(req,res){
    let playerName = await getusername();
    const user = await Users.get_player(playerName);
    const curGame = user[0].cur_game;
    const gamesCollection = await _get_games_collection();
    let player_collection = await _get_user_collection();

    let game = await gamesCollection.findOne({ gameName: curGame })
    if (!game) {
        res.status(404).send(`Game ${curGame} not found.`);
        return;
    }
    if (!game.players || game.players.length === 0) {
        res.status(404).send(`No players found in game ${curGame}.`);
        return;
    }
    let players = game.players;
    let highest = -1;
    let winner = '';
    for(let i = 0; i < players.length; i++ ){
        let playerTotal = await Users.player_total(players[i]);
        console.log(players[i])
        await player_collection.updateOne({ name: players[i] }, { $set: { cur_game:null, balance: 2000, portfolio: [] } });
        if (playerTotal>highest){
            highest = playerTotal;
            winner = players[i];
        }
    }
    
    if (winner) {
        await gamesCollection.deleteOne({ gameName: curGame });
        await player_collection.updateOne({ name: playerName }, { $set: { cur_game: null } });
        res.status(200).send(`The winner of game ${curGame} is ${winner}.`);
    } else {
        res.status(404).send(`No winner found for game ${curGame}.`);
    }

}

