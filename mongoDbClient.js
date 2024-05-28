const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const MONGO_DB_FREE_TEXT_COLLECTION = "freeText";

const client = new MongoClient(process.env.MONGO_DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function establishFreeTextConnection() {
    await client.connect();
    
    const database = client.db(process.env.MONGO_DB_FREE_TEXT_NAME);
    const collection = database.collection(MONGO_DB_FREE_TEXT_COLLECTION);
    return { database, collection };
}

module.exports = {
    client,
    establishFreeTextConnection
};