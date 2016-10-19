const express = require('express');

const { db } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.listen(3000, () => {
  console.log('Express is listening on port 3000');
}); 
