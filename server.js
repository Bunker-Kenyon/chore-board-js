const express = require('express');
const app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
let { getChoresFromDb: getChoresFromDb, 
		userLogin: userLogin, 
		getUnassignedChoresFromDb: getUnassignedChoresFromDb,
		getCurrentUserChoresFromDB: getCurrentUserChoresFromDB,
		getChoreLibraryFromDb: getChoreLibraryFromDb,
		getRewardLibraryFromDb: getRewardLibraryFromDb} = require('./models/models.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static("public"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/getChores', getChores);
app.get('/getChoreLibrary', getChoreLibrary);
app.get('/getUnassignedChores', getUnassignedChores);
app.get('/getCurrentUserChores', getCurrentUserChores);
app.get('/getChoreLibraryData', getChoreLibraryData);
app.get('/getRewardLibraryData', getRewardLibraryData)

app.get('/login', function(request, response) {
	console.log("Going to login");
	response.sendFile(path.join(__dirname + '/public/login.html'));
});

app.post('/auth', userLogin);

// Start the server running
app.listen(app.get('port'), function() {
    console.log('ChoreBoard app is running on port', app.get('port'));
  });


function getChores(request, response) {
    var householdID = request.session.household_id;
	var userID = request.session.user_id;
	
    getChoresFromDb(householdID, userID, function(error, result) {
		
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			const chores = result;
			//console.log(result);
		  	response.render('pages/chores', {data: chores, userID: userID});	
		}
	});
}

function getChoreLibrary(request, response) {
	var householdID = request.session.household_id;
	getChoreLibraryFromDb(householdID, function(error, result) {
		
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			const chores = result;
			//console.log(result);
		  	response.render('pages/chore_library', {data: chores});	
		}
	});
}

function getChoreLibraryData(request, response) {
	var householdID = request.session.household_id;
	getChoreLibraryFromDb(householdID, function(error, result) {
		const chores = result;
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			
			response.send(chores);
			//console.log(result);
		}
	});
}

function getRewardLibraryData(request, response) {
	var householdID = request.session.household_id;
	getRewardLibraryFromDb(householdID, function(error, result) {
		const rewards = result;
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			
			response.send(rewards);
			//console.log(result);
		}
	});
}

function getUnassignedChores(request, response) {
	var householdID = request.session.household_id;
	getUnassignedChoresFromDb(householdID, function(error, result) {
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			const chores = result;
		  	response.render('pages/chores', {data: chores});	
		}
	});
}

//TODO: Test. Might need to change the render part
function getCurrentUserChores(request, response) {
	var householdID = request.session.household_id;
	var userID = request.session.user_id;
	getCurrentUserChoresFromDB(householdID, userID, function(error, result) {
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			const chores = result;
			console.log("My Chores: " + chores.json.stringify);
		  	response.render('pages/chores', {data: chores});	
		}
	});
}

