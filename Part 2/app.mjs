

import express, { json, urlencoded } from 'express';
import {register,login ,buyStock, sellStock, get_player,player_portfolio } from './controller/user.mjs';
import { create_game, join_game, game_winner } from './controller/game.mjs';
import { connectToDB, closeDBConnection } from './utils/db.mjs';
const app = express();
const port = 8820;

app.use(json());// support json encoded bodies
app.use(urlencoded({extended: true}));//incoming objects are strings or arrays

var server;

async function createServer(){
    try{
        await connectToDB();
        // API resource paths
        app.post('/register',register)
        app.post('/login',login)
        app.post('/buy/:name', buyStock);
        app.post('/sell/:name', sellStock);
        app.post('/create_game/:gameName', create_game);
        app.post('/join_game/:gameName', join_game);
        app.get('/game_winner/:gameName', game_winner);
        app.get('/info/:name', get_player)
        app.get('/portolio/:name', player_portfolio)
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