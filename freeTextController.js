const { MongoClient, ObjectId } = require('mongodb');
const { client, establishFreeTextConnection } = require('./mongoDbClient');
require('dotenv').config();

const FREE_TEXT_MONGO_DB_COLLECTION_NAME = 'freeText'
const dbName = process.env.MONGO_DB_FREE_TEXT_NAME;
const collectionName = FREE_TEXT_MONGO_DB_COLLECTION_NAME;

const NO_RECORDS_RESPONSE = 'There are no records saved to the DB!';


async function insertFreeTextRecord(submissionText) {
    try {
        const { collection } = await establishFreeTextConnection();
    
        const freeTextSubmissions = [
            {
                name: submissionText,
            }
        ];
        const insertManyResult = await collection.insertMany(freeTextSubmissions);
        console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
        return submissionText;
    } catch (err) {
        console.error(`Error on saving documents: ${err}\n`);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function fetchRandomFreeTextRecord(submissionText) {
    try {
        const { collection } = await establishFreeTextConnection();
     
        // Count the number of documents in the collection
        const count = await collection.countDocuments();

        if (count === 0) {
            return {
                'error': 'No documents stored in DB!'
            }
        }
            
        // Generate a random index within the range of the document count
        const randomIndex = Math.floor(Math.random() * count);

        // Find a document at the random index
        const randomDocument = await collection.find().limit(1).skip(randomIndex).next();

        // return both the id and name so that id can be used to delete.
        return {
            'id': randomDocument._id.toString(),
            'name': randomDocument.name
        };
    
    } catch (err) {
        console.error(`Something went wrong trying to find the random document: ${err}\n`);
        throw err; 
    } finally {
        await client.close();
    }
}

async function deleteFreeTextRecord(textId) {
    try {
        const { collection } = await establishFreeTextConnection();
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(textId) });

        if (deleteResult.deletedCount === 1) {
            console.log("Successfully deleted one document.");
          } else {
            return {
                'error': 'No document found. Deleted 0 documents.'
            }
          }
        } finally {
          await client.close();
        }
}

module.exports = {
    insertFreeTextRecord,
    fetchRandomFreeTextRecord,
    deleteFreeTextRecord
};