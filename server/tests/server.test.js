const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateTodos, populateUsers);

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
        expect(res.body.length).toBe(2);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /todos/:id', () => {
  it('should send todo if id matches existing todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.description).toBe(todos[0].description);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should send a 404 status if todo not found', (done) => {
    const id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should send a 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

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
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should send a 404 if todo is not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const isComplete = true;
    const description = 'Test success!';
    const id = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${id}`)
      .send({ description, isComplete })
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);

        Todo.findById(id).then((todo) => {
          expect(todo.description).toBe(description);
          expect(todo.isComplete).toBe(isComplete);
          expect(todo.completedAt).toExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const id = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .send({ isComplete: false })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end((err, res) => {
        if(err) return done(err);

        Todo.findById(id).then((todo) => {
          expect(todo.isComplete).toBe(false);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    const email = 'newuser@email.com';
    const password = 'abc1234!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findOne({ email }).then((doc) => {
          expect(doc.email).toBe(email);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should send a 400 for empty fields', (done) => {
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should send a 400 for invalid fields', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'email3@email.com',
        password: 'abc'
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
