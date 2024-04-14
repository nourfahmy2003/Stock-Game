import express, { json, urlencoded } from 'express';
import {register,login ,buyStock, sellStock, get_player,player_portfolio,current_player_info,current_player_portfolio, user_change, logout } from './public/controller/user.mjs';
import { create_game, join_game, game_winner, _get_games_collection, players_list } from './public/controller/game.mjs';
import { connectToDB, closeDBConnection } from './public/utils/db.mjs';
import { fileURLToPath } from 'url';
import session from 'express-session'
import path from 'path';
import { getStockList, getStockPrice } from './public/utils/get-price.mjs';

const app = express();
const port = 8820;



app.use(json());// support json encoded bodies
app.use(urlencoded({extended: true}));//incoming objects are strings or arrays


var server;

app.use(session({
    secret: 'ramadan', 
    resave: false,
    saveUninitialized: false,
}));

async function createServer(){
    try{
        await connectToDB();
        const __fileName = fileURLToPath(import.meta.url);
        const __dirName = path.dirname(__fileName);
        const publicdir = path.join(__dirName,"public");
        app.use(express.static(publicdir));
        // API resource paths

        app.get('/', (req, res) => {
            res.sendFile(path.join(publicdir, 'Pages/main.html' ))

        });

        app.post('/register',register);
        app.post('/login',login);
        app.get('/logout', logout);

        app.post('/buy', buyStock);
        app.post('/sell', sellStock);
        app.post('/create_game/:gameName', create_game);
        app.post('/join_game/:gameName', join_game);
        app.post('/change_player', user_change)

        app.get('/game_players',players_list);
        app.get('/game_winner', game_winner);
        app.get('/info', current_player_info)
        app.get('/info/:name', get_player)
        app.get('/portolio', current_player_portfolio)
        app.get('/portfolio/:name', player_portfolio);
        app.get('/stocks', getStockList);
        app.get('/games', async (req, res) => {
            try {
                const gamesCollection = await _get_games_collection();
                const games = await gamesCollection.find().toArray();
                const gameNames = games.map(game => game.gameName);

                // Send only the names in the response
                res.json(gameNames);
            } catch (error) {
                console.error('Error fetching list of games:', error);
                res.status(500).send('Internal Server Error');
            }
        });
        app.get('/stock/:symbol', async (req, res) => {
            const symbol = req.params.symbol;
            try {
                const price = await getStockPrice(symbol);
                res.json({ price });
            } catch (error) {
                console.error('Error fetching stock price:', error);
                res.status(500).json({ error: 'Error fetching stock price' });
            }
        });
        server = app.listen(port, () => {
            console.log('App listening at http://localhost:%d', port);
        });
    } 
catch(err){
    console.log(err);
}
}

createServer()

process.on('SIGINT', () => {
    console.log('SIGINT signal recived');
    console.log('Closing mongo client');
    server.close( async function(){
        let message = await closeDBConnection();
        console.log(message);
    });
});