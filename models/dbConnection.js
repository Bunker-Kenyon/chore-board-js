require('dotenv').config();
const Pool = require("pg").Pool;
const connectionString = process.env.DATABASE_URL

// Establish a new connection to the data source specified the connection string.

const pool = new Pool(
    {connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false 
      }
});

module.exports = {pool};



