const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27107/TodoAppMy');

const app = mongoose.connection;

app.on('error', (err) => {
  console.log('Unable to connect to MongoDB', err);
});

app.once('open', () => {
  console.log('Successfully connected to MongoDB');
})

module.exports = {
  mongoose
};
