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
    deleteFromChoreLibrary: deleteFromChoreLibrary
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

app.post('/auth', userLogin);
app.post('/getAddToRewardLibrary', getAddToRewardLibrary);
app.post('/getDeleteFromRewardLibrary', getDeleteFromRewardLibrary);
app.post('/getAddToChoreLibrary', getAddToChoreLibrary);
app.post('/getDeleteFromChoreLibrary', getDeleteFromChoreLibrary);

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
            response.render('pages/chores', { data: chores, userID: userID });
        }
    });
}



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