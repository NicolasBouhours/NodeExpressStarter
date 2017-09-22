const mongoose = require('mongoose');
const util = require('util');

const config = require('./config/config');
const app = require('./config/express');

const debug = require('debug')('nodeexpressstarter:index');

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent is required for mocha watch feature
if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`Server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
