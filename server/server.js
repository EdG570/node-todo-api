let env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppMy';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppMyTest';
}

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { db } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

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
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
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

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: 'Invalid ID'
    });
  }

  Todo.findByIdAndRemove({ _id: id }).then((todo) => {
    if (!todo) {
      res.sendStatus(404);
    }

    res.status(200).send(todo);
  }, (error) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ['description', 'isComplete']);

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  if (_.isBoolean(body.isComplete) && body.isComplete) {
    body.completedAt = new Date().getTime();
  } else {
    body.isComplete = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch((e) => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Express is listening on port: ${port}`);
});

module.exports = {
  app
};
