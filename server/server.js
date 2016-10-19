const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

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

app.get('/todos', (req, res) => {
  Todo.find({}).then((todos) => {
    res.send(todos);
  }, (err) => {
    res.status(400).send();
  })
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send({
      error: 'Invalid ID'
    });
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }

    res.status(200).send(todo);
  }, (err) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Express is listening on port 3000');
});

module.exports = {
  app
};
