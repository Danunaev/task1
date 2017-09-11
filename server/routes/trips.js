const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('./database');

router.get('/', (request, response) => {
	response.locals.title = 'Trips';
	database.getDb('./trips.json').then(tDb => {
		database.getDb('./locations.json').then(lDb => {

			response.locals.trips = tDb.trips;
			response.locals.locations = lDb.locations;
			response.render('trips');
		});
	});
});

router.post('/', (request, response) => {
	const {name, location, arrivalDate, destinationDate} = request.body;
	console.log(location);
	database.getDb('./trips.json').then(tDb => {
		database.getDb('./locations.json').then(lDb => {
			const maxId = database.generateId(tDb.trips);
	    	const id ='trp' + (maxId + 1);
	    	const trip = {
	    		id, 
	    		name,
	    		route: {
		    		location: Array.isArray(location) ? location : [location || "No Locations"], 
		    	 	arrivalDate: arrivalDate, 
		    	 	destinationDate: destinationDate 
		    	}
		    };
			tDb.trips.push(trip);

			return database.writeDb('./trips.json', tDb).then(() => {
				response.locals.trips = tDb.trips;
				response.locals.locations = lDb.locations;
				response.render('trips');
			})
			
		});
	});
});

router.get('/edit/:id', (request, response) => {
	response.locals.title = 'Edit Trips';
	database.getDb('./trips.json').then(tDb => {
		database.getDb('./locations.json').then(lDb => {
			const tripId = request.params.id;
			const trip = tDb.trips.find(trip => trip.id === tripId);
			response.locals.trip = trip;
			response.locals.locations = lDb.locations;
			response.render('editTrip');
		});
	});
});

router.post('/edit/:id', (request, response) => {
	const {name, location, arrivalDate, destinationDate} = request.body;

	database.getDb('./trips.json').then(tDb => {
		database.getDb('./locations.json').then(lDb => {
			const tripId = request.params.id;
			let {trips} = tDb;
			trips.splice(Number(tripId[3])-1,1,{
				id:tripId,
				name, 
				route: {
		    		location: Array.isArray(location) ? location : [location || "No Locations"], 
		    	 	arrivalDate: arrivalDate, 
		    	 	destinationDate: destinationDate 
		    	}
			})
			return database.writeDb('./trips.json', tDb).then(() => {
				response.locals.trips = tDb.trips;
				response.locals.locations = lDb.locations;
				response.render('trips');
			})
		});
	});
});

router.get('/delete/:id', (request, response) => {
	database.getDb('./trips.json').then(tDb => {
		database.getDb('./locations.json').then(lDb => {
			const userId = request.params.id;
			let {trips} = tDb;
			trips.splice(trips.indexOf(trips.find( user=> user.id === userId )),1)
			return database.writeDb('./trips.json', tDb).then(() => {
				response.locals.trips = tDb.trips;
				response.locals.locations = lDb.locations;
				response.render('trips');
			})
		});
	});
});

module.exports = router;