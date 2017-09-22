const config = require('./config/config');
const app = require('./config/express');

app.listen(config.port, () => {
  console.info(`Server started on port ${config.port} (${config.env})`);
});

module.exports = app;
