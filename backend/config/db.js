const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning]: Could not connect to remote MongoDB (${error.message}).`);
    console.warn(`[Fallback Mode]: Server is operational with resilient fallback handlers.`);
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
