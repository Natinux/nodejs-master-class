
const handlers = {};

// Define all the handlers
handlers.hello = (data, callback) => callback(406, {'message': 'well... hello!'});
handlers.notFound = (data, callback) => callback(404);

module.exports = handlers;