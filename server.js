const express = require('express');
const app = express();
let {getChoresFromDb: getChoresFromDb} = require('./models/models.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static("public"));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getChores', getChores)

// Start the server running
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });


function getChores(request, response) {
    var householdID = 1;
    getChoresFromDb(householdID, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		console.log('Result: ' + JSON.stringify(result));
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			const chores = result;
			/* for (var property in chores) {
				console.log(property,":",chores[property]);
		  } */
		  	response.render('pages/chores', {data: chores});
			
		}
	});
}

