const express = require('express');
const app = express();
let {pool: pool} = require('./dbConnection.js');

function getChoresFromDb(householdID, userID, callback) {
	console.log("Getting chores from DB with household_id: " + householdID);

	//const sql = 'SELECT * FROM chores WHERE household_id = $1::int AND date_completed IS NULL;';
	const sql = `SELECT chores.chore_name, users.user_id, users.display_name, users.email, 
			chores.description, date_completed, xp_reward, reward_library.reward_name
		FROM chores
		LEFT JOIN users
		ON chores.assigned_to_user_id=users.user_id
		LEFT JOIN reward_library
		ON chores.rewards_id=reward_library.reward_library_id 
		WHERE chores.household_id = $1::int
		ORDER BY chores.chore_name;`;
	const params = [householdID];

	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}
		// Log this to the console for debugging purposes.
		//console.log("Found result: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getChoreLibraryFromDb(householdID, callback) {
	const sql = 'SELECT * FROM chore_library WHERE household_id = $1::int;';
	/* const sql = `SELECT * FROM chore_library 
	LEFT JOIN reward_library
	ON chore_library.reward_library_id = reward_library.reward_library_id
	WHERE chore_library.household_id = 1
	ORDER BY chore_library.chore_name;`; */
	const params = [householdID];
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		//console.log("Found result: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getRewardLibraryFromDb(householdID, callback) {
	const sql = 'SELECT * FROM reward_library WHERE household_id = $1::int;';
	const params = [householdID];
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		//console.log("Found result: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getUnassignedChoresFromDb(householdID, callback) {
	const sql = 'SELECT * FROM chores WHERE household_id = $1::int AND assigned_to_user_id IS NULL;';
	const params = [householdID];
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});

}

function getCurrentUserChoresFromDB(householdID, userID, callback) {
	const sql = 'SELECT * FROM chores WHERE household_id = $1::int AND assigned_to_user_id = $2::int;';
	const params = [householdID, userID];
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result USer: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function userLogin(request, response, callback) {
	var email = request.body.email;
	var password = request.body.password;
	var sql = "SELECT * FROM users WHERE email = $1::varchar AND password = $2::varchar";

	if (email && password) {
		pool.query("SELECT * FROM users WHERE email = $1::varchar AND password = $2::varchar", [email, password], function(err, result) {
			if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
				return;
			}
			if (result.rowCount > 0) {
				request.session.loggedin = true;
				request.session.email = email;
				request.session.household_id = result.rows[0].household_id;
				request.session.user_id = result.rows[0].user_id;
				response.locals.user_id = request.session.user_id;

				// Log this to the console for debugging purposes.
				console.log("Household ID: " + request.session.household_id);
				console.log("User ID: " + request.session.user_id);

				response.redirect('/getChores');
			} else {
				response
				.send('Incorrect Email and/or Password!');
			}
			callback(null, result.rows);		
			response.end();
			
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
};

module.exports = {getChoresFromDb, userLogin, getUnassignedChoresFromDb, getCurrentUserChoresFromDB, 
	getChoreLibraryFromDb, getRewardLibraryFromDb};