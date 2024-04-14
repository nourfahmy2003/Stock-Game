
import { validate_fields } from '../utils/validate-fields.mjs';
import { Users } from '../model/Users.mjs';
import { getStockPrice } from '../utils/get-price.mjs';
import { getDb } from '../utils/db.mjs';
import { Game } from '../model/Games.mjs';

/**
 * A function that adds a Users to the database.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */


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
export async function _get_games_collection() {
    let db = await getDb();
    return await db.collection('Games');
}

var username;

export async function getusername(){
    return username
}
export async function register(req, res) {
    let name = req.body.username;
    let password = req.body.password;
    let isHost = req.body.isHost;
    let isValid = await validate_fields(name);
    let collection = await _get_user_collection();
    let existingname = await collection.find({name:name}).toArray();
    
    if (isValid && (!existingname||existingname.length == 0)){
        let new_player = new Users(name, password, isHost);
        let msg = await new_player.save();
        // res.send('User correctly inserted in the Database.'); 
        req.session.userid = name
        username = name;
        res.status(200).redirect('./Pages/player.html');     
    } else {
        console.log('The Contact was not inserted in the database since it is not valid.');
        res.send('Error. Username already in use.');
    }
}

export async function login(req, res) {
    const name = req.body.username;
    let password = req.body.password;
    const collection = await _get_user_collection();
    
    if (!name || !password) {
        res.status(400).send('Name and password are required.');
        return;
    }

    let users = await Users.get_player(name);
    let user = users[0]
    if (!user || user == 0) {
        res.status(404).send('User not found.');
        return;
    }

    // Check if the provided password matches the stored password
    if (user.password != password) {
        res.status(401).send('Invalid password.');
        return;
    }
    
    req.session.userid=name;
    username = name;
    console.log('Session data:', req.session.userid);
    if(user.isHost){
        res.status(200).redirect('./Pages/host.html');
    }
    else{res.status(200).redirect('./Pages/player.html');}
    
}

export async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal server error.');
            return;
        }
        res.json({ redirect: './main.html' });
    });
}
/**
 * A function that lists all contacts with all information that is
 * in the file. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function list_all(req, res) {    
    let objs = await Users.getAll();
    console.log(objs.length+' item(s) sent.');
    res.send(objs);        
}

/**
 * A function that gets a contact by name and returns all
 * data of the requested contact. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function get_player(req, res) {
    let name_to_match = req.params.name;
    let obj = await Users.get_player(name_to_match);
    if (obj.length > 0){
        
        res.send(obj[0]);        
    }else{
        res.status(400).send('No item was found');
    }
    
}



/**
 * A function to update the information about a given contact.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function update_player(req, res) {
    let name_to_match = req.params.name;
    let new_name = req.body.name;
    let isValid = await validate_fields(new_name);
    if (isValid){
        let msg = await Users.update(name_to_match, new Users(new_name))
        res.send(msg);
    } else {
        console.log("The document was not updated");
        let msg = 'The new user data is not valid.';
        res.send(msg);
    }
}

/**
 * A function that deletes the information about a given contact.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function delete_player(req, res) {
    let name_to_delete = req.params.name;
    let msg = await Users.delete(name_to_delete);
    res.send(msg);
}

async function price_change(price, prev_price,cost){
    let percentage_diff = (price - prev_price)/100;
    let price_diff = cost * percentage_diff;
    return price_diff;
}

export async function buyStock(req, res) {
    if (req.session.userid == null){
        req.session.userid = username
    }
    let playerName = req.session.userid;
    let stockSymbol = req.body.symbol;
    let quantity = parseInt(req.body.quantity);
    let player_collection = await _get_user_collection();


    let player = await Users.get_player(playerName);
    
    if (player && player.length > 0 && !player[0].isHost) {
        // Fetch the current stock price
        let stockPrice = await getStockPrice(stockSymbol);

        if (stockPrice) {
            let totalCost = stockPrice * quantity;

            if (player[0].balance >= totalCost) {
                // Deduct the total cost from the player's balance
                let newBalance = player[0].balance -= totalCost;

                
                let existingEntry = player[0].portfolio.find(entry => entry.symbol === stockSymbol);

                if (existingEntry) {
                    // Update the existing entry with new quantity and total cost
                    let gain_loss = await price_change(stockPrice, existingEntry.stockPrice, existingEntry.cost)
                    existingEntry.quantity += quantity;
                    existingEntry.cost += totalCost + gain_loss;
                    
                    
                } else {
                    // Add a new entry to the player's portfolio
                    let stockInfo = {
                        symbol: stockSymbol,
                        quantity: quantity,
                        cost: totalCost,
                        stockPrice: stockPrice
                    };
                    player[0].portfolio.push(stockInfo);
                }

                

                // Update the player's information in the database
                await player_collection.updateOne({ name: playerName }, { $set: { balance: newBalance, portfolio: player[0].portfolio } });



                res.status(200).send(`Successfully bought ${quantity} shares of ${stockSymbol}`);
            } else {
                res.status(404).send('Insufficient funds to buy the specified quantity of stocks.');
            }
        } else {
            res.status(404).send(`Error fetching stock price for ${stockSymbol}.`);
        }
    } else {
        res.status(404).send(`Player ${playerName} not found.`);
    }
}

export async function sellStock(req, res) {
    if (req.session.userid == null){
        req.session.userid = username
    }
    let fee = 10;
    let playerName = req.session.userid;
    let stockSymbol = req.body.symbol;
    let quantity = parseInt(req.body.quantity);
    let player_collection = await _get_user_collection();

    let player = await Users.get_player(playerName);
    if (player && player.length > 0) {
        // Fetch the current stock price
        let stockPrice = await getStockPrice(stockSymbol);
        if (stockPrice) {
            // Selling logic
            let existingEntry = player[0].portfolio.find(entry => entry.symbol === stockSymbol);

            if (existingEntry && existingEntry.quantity >= quantity) {
                let gain_loss = await price_change(stockPrice,existingEntry.stockPrice,existingEntry.cost);
                let saleProceeds = (stockPrice + gain_loss) * quantity;
                let newBalance = player[0].balance + saleProceeds - fee;
                // Update the existing entry with reduced quantity
                existingEntry.quantity -= quantity;

                // If the quantity becomes zero, remove the entry from the portfolio
                if (existingEntry.quantity === 0) {
                    
                    player[0].portfolio = player[0].portfolio.filter(entry => entry.symbol !== stockSymbol);
                }

                // Update the player's information in the database
                await player_collection.updateOne({ name: playerName }, { $set: { balance: newBalance, portfolio: player[0].portfolio } });

                res.send(`Successfully sold ${quantity} shares of ${stockSymbol}`);
            } else {
                res.send('Insufficient stocks to sell or stock not found in the portfolio.');
            }
        } else {
            res.send(`Error fetching stock price for ${stockSymbol}.`);
        }
    } else {
        res.send(`Player ${playerName} not found.`);
    }
}

export async function user_change(req, res) {
    if (req.session.userid == null){
        req.session.userid = username
    }
    let playerName = req.session.userid;
    console.log(playerName, 'yes')
    try {
        // Retrieve the user from the database
        const player = await Users.get_player(playerName);

        // Ensure the user exists
        if (!player || player.length === 0) {
            res.status(404).send(`User ${playerName} not found.`);
            return;
        }
        toggleUserRole(player[0])
        // Redirect based on the user's role
        if (player[0].isHost) {

            res.status(200).json({ redirect: './host.html' });
        } else {

            res.status(200).json({ redirect: './player.html' });
        }
    } catch (error) {
        console.error('Error toggling user role:', error);
        res.status(500).send('Internal server error.');
    }
}
async function toggleUserRole(player) {
    try {
        // Toggle the isHost value
        
        player.isHost = !player.isHost;
        player.cur_game = null;

        // Update the user's data in MongoDB
        let result = await Users.update(player.name, player);
    } catch (error) {
        console.error('Error toggling user role:', error);
    }
    
}
export async function player_portfolio(req,res){
    let name = req.params.name;
    console.log(name)
    try{
        let info = await Users.get_player(name);
        console.log
        let response = {
            portfolio: info[0].portfolio,
            balance: info[0].balance
        };
            res.status(400).send(response)
        }
        catch (error){
            console.error('Error getting player:', error);
            res.status(500).send('Internal server error.');
        }
}
export async function player_info(req,res){
    let name = req.params.name;
    let obj = await Users.get_player(name);
    if (obj.length > 0){
        
        res.send(obj[0]);        
    }else{
        res.status(400).send('No item was found');
    }
}

export async function current_player_info(req, res) {
    let name_to_match = req.session.userid;
    let obj = await Users.get_player(name_to_match);
    if (obj.length > 0){
        res.send(obj[0]);      
    }else{
        res.status(400).send('No item was found');
    }
    
}
export async function current_player_portfolio(req,res){
    let name = req.session.userid;

    try{
        let info = await Users.get_player(name);
        let portfolio = await info[0].portfolio;
            res.status(400).send(portfolio)
        }
        catch (error){
            console.error('Error getting player:', error);
            res.status(500).send('Internal server error.');
        }
}
