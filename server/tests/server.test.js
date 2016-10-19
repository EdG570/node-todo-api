const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

let todos = [
  {
    description: 'First test todo',
     _id: new ObjectID()
   },
  {
    description: 'Second test todo',
    _id: new ObjectID()
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const description = 'Wash the car';

    request(app)
      .post('/todos')
      .send({ description })
      .expect(200)
      .expect((res) => {
        expect(res.body.description).toBe(description);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ description }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].description).toBe(description);
          done();
        }).catch((e) => done(e));
      });
  });
});