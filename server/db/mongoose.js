const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('Unable to connect to MongoDB', err);
});

db.once('open', () => {
  console.log('Successfully connected to MongoDB');
})

module.exports = {
  db
};
