const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('./database');

router.get('/', (request, response) => {
	response.locals.title = 'Customers';
	database.getDb('./customers.json').then(cDb => {
		database.getDb('./trips.json').then(tDb => {

			response.locals.customers = cDb.customers;
			response.locals.trips = tDb.trips;
			response.render('customers');
		});
	});
});

router.post('/', (request, response) => {
	const {firstName, lastName, trips} = request.body;
	database.getDb('./customers.json').then(cDb => {
		database.getDb('./trips.json').then(tDb => {
			const maxId = database.generateId(cDb.customers);
	    	const id ='cus' + (maxId + 1);
	    	const customer = {
	    		id, 
	    		firstName, 
	    		lastName, 
	    		trips: Array.isArray(trips) ? trips : [trips || "No Trips"] 
	    	};
			cDb.customers.push(customer);
			return database.writeDb('./customers.json', cDb).then(() => {
				response.locals.trips = tDb.trips;
				response.locals.customers = cDb.customers;
				response.render('customers');
			})
		});
	});
});

router.get('/edit/:id', (request, response) => {
	response.locals.title = 'Edit Customers';
	database.getDb('./customers.json').then(cDb => {
		database.getDb('./trips.json').then(tDb => {
			const userId = request.params.id;
			const user = cDb.customers.find(user => user.id === userId);
			response.locals.user = user;
			response.locals.trips = tDb.trips;
			response.render('editCustomer');
		});
	});
});

router.post('/edit/:id', (request, response) => {
	const {firstName, lastName, trips} = request.body;

	database.getDb('./customers.json').then(cDb => {
		database.getDb('./trips.json').then(tDb => {
			const userId = request.params.id;
			let {customers} = cDb;
			customers.splice(Number(userId[3])-1,1,{
				id:userId,
				firstName, 
				lastName, 
				trips: Array.isArray(trips) ? trips : [trips || "No Trips"] 
			})
			return database.writeDb('./customers.json', cDb).then(() => {
				response.locals.customers = cDb.customers;
				response.locals.trips = tDb.trips;
				response.render('customers');
			})
		});
	});
});

router.get('/delete/:id', (request, response) => {
	database.getDb('./customers.json').then(cDb => {
		database.getDb('./trips.json').then(tDb => {
			const userId = request.params.id;
			let {customers} = cDb;
			customers.splice(customers.indexOf(customers.find( user=> user.id === userId )),1)
			return database.writeDb('./customers.json', cDb).then(() => {
				response.locals.customers = cDb.customers;
				response.locals.trips = tDb.trips;
				response.render('customers');
			})
		});
	});
});

module.exports = router;