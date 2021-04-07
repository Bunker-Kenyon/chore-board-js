const express = require("express");
const app = express();
let { pool: pool } = require("./dbConnection.js");

function getChoresFromDb(householdID, userID, callback) {
    console.log("Getting chores from DB with household_id: " + householdID);

    //const sql = 'SELECT * FROM chores WHERE household_id = $1::int AND date_completed IS NULL;';
    const sql = `SELECT chores.chore_id, chores.chore_name, users.user_id, users.display_name, users.email, 
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
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }
        // Log this to the console for debugging purposes.
        //console.log("Found result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });
}

function getChoreLibraryFromDb(householdID, callback) {
    const sql = `SELECT chore_library.chore_library_id, chore_library.chore_name, chore_library.description, chore_library.xp_reward, 
                        reward_library.reward_library_id, reward_library.reward_name, household.household_id, household.household_name
                    FROM chore_library
                    LEFT JOIN reward_library
                    ON chore_library.reward_library_id=reward_library.reward_library_id
                    LEFT JOIN public.household
                    ON chore_library.household_id=household.household_id
                    Where household.household_id = $1::int
                    ORDER BY chore_library.chore_name;`;
    const params = [householdID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        //console.log("Found result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });
}

function getRewardLibraryFromDb(householdID, callback) {
    const sql = "SELECT * FROM reward_library WHERE household_id = $1::int;";
    const params = [householdID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        //console.log("Found result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });
}

function getChoreBoardFromDb(householdID, callback) {
    console.log("Getting chores from DB with household_id: " + householdID);
    console.log("In getChoreBoardFromDb");
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
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }
        // Log this to the console for debugging purposes.
        //console.log("Found result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });
}

function userLogin(request, response, callback) {
    var email = request.body.email;
    var password = request.body.password;
    var sql =
        "SELECT * FROM users WHERE email = $1::varchar AND password = $2::varchar";

    if (email && password) {
        pool.query(
            "SELECT * FROM users WHERE email = $1::varchar AND password = $2::varchar", [email, password],
            function(err, result) {
                if (err) {
                    console.log("Error in query: ");
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

                    response.redirect("/getChores");
                } else {
                    response.send("Incorrect Email and/or Password!");
                }
                callback(null, result.rows);
                response.end();
            }
        );
    } else {
        response.send("Please enter Email and Password!");
        response.end();
    }
}

function addToRewardLibrary(rewardName, description, householdID) {
    console.log("addToRewardLibrary");
    var sql = `INSERT INTO reward_library(reward_name, description, household_id)
			VALUES($1::varchar, $2::varchar, $3::int)`;
    var params = [rewardName, description, householdID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
        }
        // Log this to the console for debugging purposes.
        console.log('addToRewardLibrary insert successful');
    });
}

function deleteFromRewardLibrary(rewardID) {
    console.log("deleteFromRewardLibrary" + rewardID);
    var sql = 'DELETE FROM reward_library WHERE reward_library_id = $1::int';
    var params = [rewardID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
        } else {
            console.log('deleteFromRewardLibrary successful');
        }
    });
}

function addToChoreLibrary(choreName, description, xp_reward, rewardID, householdID, callback) {
    console.log("addToChoreLibrary");
    var sql = `INSERT INTO chore_library(chore_name, description, xp_reward, reward_library_id, household_id)
				VALUES($1::varchar, $2::varchar, $3::int, $4::int, $5::int)`;
    var params = [choreName, description, xp_reward, rewardID, householdID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
        } else {
            console.log('addToChoreLibrary successful');
        }
    });
}

function deleteFromChoreLibrary(choreID) {
    console.log("deleteFromChoreLibrary" + choreID);
    var sql = 'DELETE FROM chore_library WHERE chore_library_id = $1::int';
    var params = [choreID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
        } else {
            console.log('deleteFromChoreLibrary successful');
        }
    });
}

function updateChoreLibrary(choreName, description, xpReward, rewardLibraryID, choreID, callback) {
    console.log("updateChoreLibrary" + choreID);
    console.log("xpReward " + xpReward);
    var sql = `UPDATE chore_library 
                SET chore_name = $1::varchar, description = $2::varchar, xp_reward = $3::int, reward_library_id = $4::int
                WHERE chore_library_id = $5::int;`;
    var params = [choreName, description, xpReward, rewardLibraryID, choreID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
        } else {
            console.log('upodateChoreLibrary successful');
        }
    });
}

function updateRewardLibrary(rewardName, description, rewardLibraryID, callback) {
    console.log("updateRewardLibrary" + rewardLibraryID);
    var sql = `UPDATE reward_library 
                SET reward_name = $1::varchar, description = $2::varchar
                WHERE reward_library_id = $3::int;`;
    var params = [rewardName, description, rewardLibraryID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
        } else {
            console.log('updateRewardLibrary successful');
        }
    });
}

function usersInHousehold(householdID, callback) {
    console.log('usersInHousehold');
    var sql = 'SELECT user_id, display_name FROM users WHERE household_id = $1::int;';
    var params = [householdID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        } else {
            console.log('usersInHousehold successful');
            callback(null, result.rows);
        }
    });
}

function assignChore(userID, choreID, callback) {
    console.log("assignChore");
    var sql = null;
    var params = null;
    if (userID == "") {
        sql = `INSERT INTO chores (chore_name, description, xp_reward, rewards_id, household_id)
            SELECT chore_name, description, xp_reward, reward_library_id, 
                household_id
        FROM chore_library
        WHERE chore_library_id = $1::int;`;
        var params = [choreID];
        console.log("assigned chore to: unassigned");
    } else {
        sql = `INSERT INTO chores (chore_name, description, xp_reward, rewards_id, household_id, 
                    assigned_to_user_id)
                SELECT chore_name, description, xp_reward, reward_library_id, 
                    household_id, (SELECT users.user_id 
                                    FROM users 
                                    WHERE user_id = $1::int)
                FROM chore_library
                WHERE chore_library_id = $2::int;`;
        var params = [userID, choreID];
        console.log("assigned chore to: " + userID);
    }

    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        } else {
            console.log('assignChore successful');
            callback(null, result.rows);
        }
    });

}

function completeChore(choreID, callback) {
    console.log("completeChore");
    var sql = `UPDATE chores
                SET date_completed = CURRENT_DATE
                WHERE chore_id = $1::int;`;

    var params = [choreID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        } else {
            console.log('completeChore successful');
            callback(null, result.rows);
        }
    });



}

function assignUnassigedChores(choreID, userID, callback) {
    console.log("assignUnassigedChores");
    var sql = `UPDATE chores
                SET assigned_to_user_id = $1::int
                WHERE chore_id = $2::int;`;
    var params = [userID, choreID];
    pool.query(sql, params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        } else {
            console.log('assignUnassigedChores successful');
            callback(null, result.rows);
        }
    });
}

module.exports = {
    getChoresFromDb,
    userLogin,
    getChoreLibraryFromDb,
    getRewardLibraryFromDb,
    getChoreBoardFromDb,
    addToRewardLibrary,
    deleteFromRewardLibrary,
    addToChoreLibrary,
    deleteFromChoreLibrary,
    updateChoreLibrary,
    updateRewardLibrary,
    usersInHousehold,
    assignChore,
    completeChore,
    assignUnassigedChores
};