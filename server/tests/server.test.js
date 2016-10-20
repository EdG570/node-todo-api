const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
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

  it('should not create todo with empty required field', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should send all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done());
  });
});

// describe('GET /todos/:id', () => {
//   it('should send todo if id matches existing todo', (done) => {
//     request(app)
//       .get(`/todos/${todos[0]._id.toHexString()}`)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.description).toBe(todos[0].description);
//       })
//       .end(done());
//   });

  // it('should send a 404 status if todo not found', (done) => {
  //   const id = new ObjectID().toHexString();
  //
  //   request(app)
  //     .get(`/todos/${id}`)
  //     .expect(404)
  //     .expect((res) => {
  //       expect(res.body.error).toBe('Invalid ID');
  //     })
  //     .end(done());
  // });
  //
  // it('should send a 404 for non-object ids', (done) => {
  //   request(app)
  //     .get('/todos/123abc')
  //     .expect(404)
  //     .end(done());
  // });
// });

describe('DELETE /todos/:id', () => {
  it('should delete a todo by ID', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.description).toBe(todos[0].description);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should send a 404 for invalid object-id', (done) => {
    request(app)
      .delete('/todos/abc123')
      .expect(404)
      .end(done());
  });

  it('should send a 404 if todo is not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done());
  });
});
