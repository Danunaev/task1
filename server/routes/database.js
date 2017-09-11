const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const writeDbFile = util.promisify(fs.writeFile);
const main = path.dirname(require.main.filename);

const database = {
	getDb: (file) => new Promise((resolve, reject) => 
		fs.readFile(path.join(main, 'db', file), 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		})).then(data => JSON.parse(data)),

	writeDb: (file,data) => {
		const str = JSON.stringify(data);
		return writeDbFile(path.join(main, 'db', file), str);
	},
	generateId: (database) => {
		return database.length ? Math.max.apply(null, database.map(item => Number(item.id[3]))) : 0;
	}
}

module.exports = database;