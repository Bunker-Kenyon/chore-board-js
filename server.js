const express = require('express');
const app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

let {
    getChoresFromDb: getChoresFromDb,
    userLogin: userLogin,
    getChoreLibraryFromDb: getChoreLibraryFromDb,
    getRewardLibraryFromDb: getRewardLibraryFromDb,
    addToRewardLibrary: addToRewardLibrary,
    deleteFromRewardLibrary: deleteFromRewardLibrary,
    addToChoreLibrary: addToChoreLibrary,
    deleteFromChoreLibrary: deleteFromChoreLibrary,
    updateChoreLibrary: updateChoreLibrary,
    updateRewardLibrary: updateRewardLibrary,
    usersInHousehold: usersInHousehold,
    assignChore: assignChore,
    completeChore: completeChore,
    assignUnassigedChores: assignUnassigedChores
} = require('./models/models.js');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logRequest);

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getChores', verifyLogin, getChores);
app.get('/getChoreLibrary', getChoreLibrary);
app.get('/getChoreLibraryData', getChoreLibraryData);
app.get('/getRewardLibraryData', getRewardLibraryData);
app.get('/login', function(request, response) {
    console.log("Going to login");
    response.sendFile(path.join(__dirname + '/public/login.html'));
});
app.post('/getCompleteChore', getCompleteChore);
app.get('/getUsersInHousehold', getUsersInHousehold);
//app.get('getPopulateChoreBoardData', getPopulateChoreBoardData);


app.post('/auth', userLogin);
app.post('/getAddToRewardLibrary', getAddToRewardLibrary);
app.post('/getDeleteFromRewardLibrary', getDeleteFromRewardLibrary);
app.post('/getAddToChoreLibrary', getAddToChoreLibrary);
app.post('/getDeleteFromChoreLibrary', getDeleteFromChoreLibrary);
app.post('/getUpdateChoreLibrary', getUpdateChoreLibrary);
app.post('/getUpdateRewardLibrary', getUpdateRewardLibrary)
app.post('/getAssignUnassigedChores', getAssignUnassigedChores)
app.post('/getAssignChore', getAssignChore);

app.get('/logout', function(req, res, next) {
    // destroy session data
    req.session = null;

    // redirect to homepage
    res.redirect('/login');
});

// Start the server running
app.listen(app.get('port'), function() {
    console.log('ChoreBoard app is running on port', app.get('port'));
});

function logRequest(request, response, next) {
    console.log("Recieved a request for: " + request.url);
    return next();
}

function verifyLogin(request, response, next) {
    console.log(request.session.user_id)
    if (request.session.user_id) {
        next();
    } else {
        var result = { success: false, message: "Access Denied" };
        response.status(401).json(result);
    }
}

function getChores(request, response) {
    var householdID = request.session.household_id;
    var userID = request.session.user_id;

    getChoresFromDb(householdID, userID, function(error, result) {

        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            const chores = result;
            response.render('pages/chores', { chores: chores, userID: userID });

        }
    });
}

/* function getPopulateChoreBoardData(request, response) {
    console.log("getPopulateChoreBoardData");
    var householdID = request.session.household_id;
    var userID = request.session.user_id
    var chores = null;
    var choreLibrary = null;
    var users = null;

    //populate unnassigned chores
    getChoresFromDb(householdID, userID, function(error, result) {

        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            chores = result;
            //console.log(chores);
            response.render('pages/chores', { chores: chores, choreLibrary: choreLibrary, users: users, userID: userID });
        }
    });

    //choose chore
    getChoreLibraryFromDb(householdID, function(error, result) {

        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            choreLibrary = result;
            console.log(choreLibrary);
            response.render('pages/chores', { choreLibrary: choreLibrary, chores: chores, users: users, userID: userID });
        }
    });

    //choose user
    getUsersInHousehold(householdID, function(error, result) {

        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            users = result;
            //console.log(users);
            //response.send(result);
        }
    });

    console.log("getPopulateChoreBoardData: " + chores);
    console.log("getChoresFromDb: " + choreLibrary);
    console.log("getUsersInHousehold: " + users);
    //response.render('pages/chores', { chores: chores, choreLibrary: choreLibrary, users: users, userID: userID });

} */

function getChoreLibrary(request, response) {
    var householdID = request.session.household_id;
    getChoreLibraryFromDb(householdID, function(error, result) {

        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            const chores = result;
            response.render('pages/chore_library', { data: chores });
        }
    });
}

function getChoreLibraryData(request, response) {
    var householdID = request.session.household_id;
    getChoreLibraryFromDb(householdID, function(error, result) {
        const chores = result;
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {

            response.send(chores);
        }
    });
}

function getRewardLibraryData(request, response) {
    var householdID = request.session.household_id;
    getRewardLibraryFromDb(householdID, function(error, result) {
        const rewards = result;
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {

            response.send(rewards);
        }
    });
}

function getAddToRewardLibrary(request, response) {
    console.log("getAddToRewardLibrary");
    var rewardName = request.body.reward_name;
    var description = request.body.description;
    var householdID = request.session.household_id;

    addToRewardLibrary(rewardName, description, householdID, function(error, result) {
        const rewards = result;
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log(result);
            response.redirect('/getChoreLibrary');
        }
    });
}

function getDeleteFromRewardLibrary(request, response) {

    var rewardID = request.body.reward_library_id;
    console.log("getDeleteFromRewardLibrary" + rewardID);

    deleteFromRewardLibrary(rewardID, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log(result);
            response.redirect('/getChoreLibrary');
        }
    });
}

function getAddToChoreLibrary(request, response) {
    console.log("getAddToChoreLibrary");
    var choreName = request.body.chore_name;
    var description = request.body.description;
    var xp_reward = request.body.xp_reward;
    var rewardID = request.body.reward_library_id;
    var householdID = request.session.household_id;

    addToChoreLibrary(choreName, description, xp_reward, rewardID, householdID, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log(result);
            response.redirect('/getChoreLibrary');
        }
    })
}

function getDeleteFromChoreLibrary(request, response) {
    var choreID = request.body.chore_library_id;
    console.log("getDeleteFromChoreLibrary" + choreID);

    deleteFromChoreLibrary(choreID, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log(result);
            response.redirect('/getChoreLibrary');
        }
    });
}

function getUpdateChoreLibrary(request, response) {
    console.log("getUpdateChoreLibrary");
    var choreName = request.body.chore_name;
    var description = request.body.description;
    var xpReward = request.body.xp_reward;
    var rewardLibraryID = request.body.reward_library_id;
    var choreID = request.body.chore_library_id;

    updateChoreLibrary(choreName, description, xpReward, rewardLibraryID, choreID, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log(result);
            response.redirect('/getChoreLibrary');
        }
    });
}

function getUpdateRewardLibrary(request, response) {
    console.log("getUpdateRewardLibrary");
    var rewardName = request.body.reward_name;
    var description = request.body.description;
    var rewardLibraryID = request.body.reward_library_id;

    updateRewardLibrary(rewardName, description, rewardLibraryID, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log(result);
            response.redirect('/getChoreLibrary');
        }
    });
}

function getUsersInHousehold(request, response) {
    //console.log("getUsersInHousehold");
    var householdID = request.session.household_id;
    usersInHousehold(householdID, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            response.send(result);
        }
    });
}

function getAssignChore(request, response) {
    console.log("getAssignChore");
    //console.log("User: " + request.body.user_id)
    assignChore(request.body.user_id, request.body.chore_library_id, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            response.redirect('/getChores');
        }
    });
}

function getCompleteChore(request, response) {
    console.log("getCompleteChore");
    completeChore(request.body.chore_id, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            response.redirect('/getChores');
        }
    });
}

function getAssignUnassigedChores(request, response) {
    console.log("getAssignUnassigedChores");
    assignUnassigedChores(request.body.chore_id, request.body.user_id, function(error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            response.redirect('/getChores');
        }
    });
}