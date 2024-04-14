import { MongoClient } from 'mongodb';
const uri ="mongodb://localhost:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });
import { getDb } from '../utils/db.mjs';
import { getStockPrice } from '../utils/get-price.mjs';

async function _get_players_collection(){
    console.log('Getting the database connection...');
    let db = await getDb();
   

    if (db) {
        console.log('Database connection successful.');
        return await db.collection('Users');
    } else {
        console.error('Failed to get a valid database connection.');
        return null; // or handle the error appropriately
    }
};

/**
 * The class contact, with a main constructor and two methods
 * to add more fields retrieved with the third-party APIs
 */

class Users {
    constructor(name, password, isHost = false){
        this.name = name;
        this.password = password;
        this.balance =  2000; // Set balance to null for hosts
        this.portfolio = [];
        this.games = null;
        this.isHost = isHost;
        this.cur_game = null;

    }

    
    
    /**
     * This method saves the current object Contact in the Database
     * @returns {String} - A message if contact was saved in the db or not
     */
    async save(){
        try {
            let collection = await _get_players_collection();
            let mongoObj = await collection.insertOne({
                name: this.name,
                balance: this.balance,
                portfolio: this.portfolio,
                isHost: this.isHost,
                password: this.password,
                cur_game: this.cur_game
            });
    
            console.log(`1 player was inserted in the database with id -> ${mongoObj.insertedId}`);
            return 'Player correctly inserted in the Database.';
        } catch (err) {
            throw err;
        }
    }
    /**
     * This static method for the class Contact will retrieve
     * all the contacts inside the database
     * @returns {Array[Contact]} - An array with all contacts retrieved
     */
    static async getAll(){
        let collection = await _get_players_collection();
        let objs = await collection.find({}).toArray();
        return objs;                
    }
    /**
     * This method will retrieve a contact with the name passed
     * as a parameter
     * @param {String} name - the name of the contact to be retrieved
     * @returns {Contact} - An object Contact with all contact's data
     */
    static async get_player(name){
        let collection = await _get_players_collection();
        let obj = await collection.find({"name": name}).toArray();
        
        return obj;
    }
    /**
     * This method will update the contact's data
     * @param {String} name - The name to be updated
     * @param {Contact} new_contact - An object of class Contact
     * @returns {String} A message if the contact was updated or not
     */
    static async update(name, newValues){
        let collection = await _get_players_collection();
        let newBalance = newValues.isHost ? null : 2000; // Calculate the new balance based on the isHost value
        let newPortfolio = newValues.isHost ? null : []; // Calculate the new portfolio based on the isHost value
        let newVals = {
            $set: {
                'isHost': newValues.isHost,
                'balance': newBalance,
                'portfolio': newPortfolio,
                // Add other fields here if needed
            }
        };
        let obj = await collection.updateOne({ 'name': name }, newVals);
        if (obj.modifiedCount > 0) {
            return 'User correctly updated.';
        } else {
            return 'User was not updated';
        }
    }

    static async  update_cur_game(username, gameName) {
        let userCollection = await _get_players_collection();
        await userCollection.updateOne({ name: username }, { $set: { cur_game: gameName } });
    }
    /**
     * This method will detele the player with the specified
     * name.
     * @param {String} name_to_delete - A name to be deleted
     * @returns {String} A message if the contact was deleted or not
     */
    static async delete(name_to_delete){
        let collection = await _get_players_collection();
        let obj = await collection.deleteOne({'name': name_to_delete})
        if (obj.deletedCount > 0){
            return 'Contact was deleted.'
        }else{
            return 'Contact was not found'
        }
    }
    static async player_total(name){
        let collection = await _get_players_collection();
        let obj = await collection.findOne({"name": name});
        let total = await obj.balance;
        if (obj.portfolio.length == null || obj.portfolio.length == 0){
            return total
        }
        for (let i = 0; i < obj.portfolio.length;i++){
            total += obj.portfolio[i].cost
        }
        return total;
    }
    
}

const _user = Users;
export { _user as Users };