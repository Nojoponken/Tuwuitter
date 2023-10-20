import { MongoClient } from 'mongodb';

let client;
let database;

/**
 * Connect to a database using the provided configuration.
 * 
 * @param {Object} config
 * @param {Object} callback - Optional callback function 
 */
function connectToDatabase(config, callback) {
	if (database) return;

	let uri = `mongodb://${config.host}/${config.options || ''}`;

	client = new MongoClient(uri);
	database = client.db(config.database);
	callback && callback();
}

/**
 * Close the the active database connection.
 * 
 * @param {Object} callback 
 */
function closeDatabaseConnection() {
	if (client) {
		client.close();
		database = null;
	}
}

/**
 * Get the database connection.
 * 
 * @returns {Object} Database connection
 */
function getDatabaseConnection() {
	return database;
}

export { connectToDatabase, closeDatabaseConnection, getDatabaseConnection };


