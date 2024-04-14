import { MongoClient } from 'mongodb';
const uri ="mongodb://localhost:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });
var db;

/**
 * A function to stablish a connection with a MongoDB instance.
 */
export async function connectToDB() {
    try {
        // Connect the client to the server
        await client.connect();
        // Our db name is going to be contacts-db
        db = await client.db('Stocks-game');
        // let object = await db.collection('sections').find({"subject": "MATH"}).toArray();
        // console.log(object)
        console.log("Connected successfully to mongoDB");  
    } catch (err) {
        throw err; 
    } 
}
/**
 * This method just returns the database instance
 * @returns A Database instance
 */
export async function getDb() {
    return db;
}

export async function closeDBConnection(){
    await client.close();
    return 'Connection closed';
};


export default {connectToDB, getDb, closeDBConnection}