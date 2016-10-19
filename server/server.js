const express = require('express');
const bodyParser = require('body-parser');

const { db } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    description: req.body.description
  });

  todo.save().then((todo) => {
    res.send(todo);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(3000, () => {
  console.log('Express is listening on port 3000');
});
