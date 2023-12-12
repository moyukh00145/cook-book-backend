require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
const mongo_client = new MongoClient(uri);


async function connection_run(){
  try {
    await mongo_client.connect();
    const db=mongo_client.db('cook-book');

    return db;

  } catch (error) {
    
  }
}
module.exports = connection_run;