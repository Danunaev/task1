const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('./database');

router.get('/', (request, response) => {
	response.locals.title = 'Locations';
	database.getDb('./locations.json').then(database => {
		const {locations} = database;
		response.locals.locations = locations;
		response.render('locations');
	});
});

router.post('/', (request, response) => {
	const {country, city} = request.body;
	
	database.getDb('./locations.json').then(lDb => {
		const maxId = database.generateId(lDb.locations);
    	const id ='loc' + (maxId + 1);
    	const location = {id, country, city};
		lDb.locations.push(location);

		return database.writeDb('./locations.json', lDb).then(() => {
			response.locals.locations = lDb.locations;
			response.render('locations');
		})
	});
});

router.get('/delete/:id', (request, response) => {
	database.getDb('./locations.json').then(cDb => {
			const userId = request.params.id;
			let {locations} = cDb;
			locations.splice(locations.indexOf(locations.find( user=> user.id === userId )),1)
			return addToDb(cDb).then(() => {
				response.locals.locations = cDb.locations;
				response.render('locations');
			})
	});
});

module.exports = router;