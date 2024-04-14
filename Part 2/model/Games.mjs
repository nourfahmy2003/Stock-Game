import { getDb } from '../utils/db.mjs';
import { Users } from './Users.mjs';

async function _get_games_collection() {
    let db = await getDb();
    return await db.collection('Games');
}




class Game {
    constructor(gameName, hostName) {
        this.gameName = gameName;
        this.hostName = hostName;
        this.players = [];
        this.public = true;
        
    }

    // async init() {
    //     while (this.gameCode === null || (await this.isGameCodeInUse())) {
    //         this.gameCode = this.generateRandomCode(6);
    //     }
    // }

    // async isGameCodeInUse() {
    //     try {
    //         // Replace with your actual function to check if the code is in use
    //         const existingGames = await _get_games_collection();
    
    //         // Ensure existingGames is an array
    //         if (Array.isArray(existingGames)) {
    //             return existingGames.some(game => game.gameCode === this.gameCode);
    //         } else {
    //             console.error('Existing games is not an array:', existingGames);
    //             return false; // Or handle the case where existingGames is not an array
    //         }
    //     } catch (error) {
    //         console.error('Error checking if game code is in use:', error);
    //         return false; // Or handle the error accordingly
    //     }
    // }

    // generateRandomCode(length) {
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     let randomCode = '';

    //     for (let i = 0; i < length; i++) {
    //         const randomIndex = Math.floor(Math.random() * characters.length);
    //         randomCode += characters.charAt(randomIndex);
    //     }

    //     return randomCode;
    // }



    async save() {
        try {
            let collection = await _get_games_collection();
            let mongoObj = await collection.insertOne({
                gameName: this.gameName,
                hostName: this.hostName,
                players: this.players,
                
            });
            return `Game "${this.name}" correctly inserted in the Database.`;
        } catch (err) {
            throw err;
        }
    }

    static async getAll() {
        let collection = await _get_games_collection();
        let objs = await collection.find({}).toArray();
        return objs;
    }

    static async get_gameName(name) {
        let collection = await _get_games_collection();
        let obj = await collection.find({ gameName: name }).toArray();
        return obj;
    }

    static async player_list(gameName){
        const gamesCollection = await _get_games_collection();
        const gameInstance = await gamesCollection.findOne({ gameName: gameName });

        if (!gameInstance) {
            throw new Error(`Game Name: ${gameName} was not found.`);
        }

        return gameInstance.players;
    }

    static async updateGame(gameInstance) {
        const gamesCollection = await _get_games_collection();
        await gamesCollection.updateOne({ gameCode: gameInstance.gameCode }, { $set: gameInstance });
    }

    static async addPlayer(gameName, playerName) {
        const gamesCollection = await _get_games_collection();
        const gameInstance = await gamesCollection.findOne({ gameName: gameName });

        if (!gameInstance) {
            throw new Error(`Game Name: ${gameName} was not found.`);
        }

        gameInstance.players.push(playerName);

        // Update the game instance in the database
        await this.updateGame(gameInstance);
    }

    async removePlayer(playerName) {
        this.players = this.players.filter(player => player !== playerName);
    }
    async portfolio(playerName){
        
    }
    static async displayTopPlayer() {
        // Logic to calculate the player with the highest money (portfolio + cash)
        // You'll need to fetch player data from the Users collection and calculate the total money for each player
        // You can then display or return the player with the highest total money
        // Note: This is a simplified example; you may need to adapt it based on your data model and requirements.

        // Example logic to fetch player data
        let topPlayer = null;
        let maxMoney = 0;

        for (const playerName of this.players) {
            const playerData = await Users.get_player(playerName);

            if (playerData && playerData.length > 0) {
                const player = playerData[0];
                const totalMoney = player.balance + player.portfolio.reduce((total, stock) => total + stock.cost, 0);

                if (totalMoney > maxMoney) {
                    maxMoney = totalMoney;
                    topPlayer = playerName;
                }
            }
        }

        return topPlayer;
    }
}

const _game = Game;
export { _game as Game };
