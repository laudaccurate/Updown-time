/*
 * For creating and editing files
 */

const fs = require('fs');
const path = require('path');

// Container for the lib module (to be exported)
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to  a file
lib.create = function (dir, file, data, callback) {
	// open the file for writing
	fs.open(
		this.baseDir + dir + '/' + file + '.json',
		'wx',
		function (err, fileDescriptor) {
			if (!err && fileDescriptor) {
				// Convert the data to a string
				var stringData = JSON.stringify(data);

				// Write data to file and close it
				fs.writeFile(fileDescriptor, stringData, function (err) {
					if (!err) {
						fs.close(fileDescriptor, function (err) {
							if (!err) {
								callback(false);
							} else {
								callback('Error closing new file');
							}
						});
					} else {
						callback('Error writing to new file');
					}
				});
			} else {
				callback('Could not create new file. It may already exist');
			}
		}
	);
};

// Read data from a file
lib.read = function (dir, file, callback) {
	fs.readFile(
		lib.baseDir + dir + '/' + file + '.json',
		'utf8',
		function (err, data) {
			callback(err, data);
		}
	);
};

// Update data in a file
lib.update = function (dir, file, data, callback) {
	// open the file for writing
	fs.open(
		lib.baseDir + dir + '/' + file + '.json',
		'r+',
		function (err, fileDescriptor) {
			if (!err && fileDescriptor) {
				// Convert the data to a string
				var stringData = JSON.stringify(data);

				// Truncate the file
				fs.truncate(fileDescriptor, function (err) {
					if (!err) {
						// Write data to file and close it
						fs.writeFile(fileDescriptor, stringData, function (err) {
							if (!err) {
								fs.close(fileDescriptor, function (err) {
									if (!err) {
										callback(false);
									} else {
										callback('Error closing existing file');
									}
								});
							} else {
								callback('Error writing to existing file');
							}
						});
					} else {
						callback('Error truncating file');
					}
				});
			} else {
				callback('Could not open the file for updating. It may not exist yet');
			}
		}
	);
};

// Delete a file
lib.delete = function (dir, file, callback) {
	// Unlink the file
	fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err) {
		if (!err) {
			callback(false);
		} else {
			callback('Error deleting existing file');
		}
	});
};

module.exports = lib;
