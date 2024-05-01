import { MongoClient } from 'mongodb';

// MongoDB Atlas connection string with the specified database
const uri = "mongodb+srv://nourfahmy2003:fahmynour68@cluster0.sr6q9k6.mongodb.net";

const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

export async function connectToDB() {
    try {
        await client.connect(); // Connect to MongoDB Atlas
        db = client.db('Stock-games'); // Set the target database
        console.log("Connected successfully to MongoDB Atlas");  
    } catch (err) {
        console.error("Connection failed:", err); // Handle connection errors
    } 
}

export async function getDb() {
    return db; // Return the database instance
}

export async function closeDBConnection() {
    await client.close(); // Close the database connection
    console.log('Connection closed');
}

export default { connectToDB, getDb, closeDBConnection };
