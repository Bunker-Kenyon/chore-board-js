const express = require('express');
const app = express();
let {pool: pool} = require('./dbConnection.js');

function getChoresFromDb(householdID, callback) {
	console.log("Getting chores from DB with household_id: " + householdID);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = `SELECT chore_library.chore_library_id, chore_library.chore_name, chore_library.description, chore_library.xp_reward,
        reward_library.reward_library_id, reward_library.reward_name, household.household_id, household.household_name
    FROM chore_library
    LEFT JOIN reward_library
    ON chore_library.reward_library_id=reward_library.reward_library_id
    LEFT JOIN public.household
    ON chore_library.household_id=household.household_id
    Where household.household_id = $1::int
    ORDER BY chore_library.chore_name;`;

    //const sql = 'SELECT household.household_id, household.household_name FROM household Where household.household_id = $1::int;';

	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	const params = [householdID];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));
		

		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});
}

module.exports = {getChoresFromDb};