import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import users from './data/user';
import group from './data/group';
import text from './data/text';

let userToken;

const { expect } = chai;
chai.use(chaihttp);

describe('Epic Test', () => {
  describe('/Display welcome message', () => {
    it('display the welcome messqge', (done) => {
      chai.request(app)
        .get('/api/v2/')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to EPic mail');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('Route', () => {
    it('should return page not found on invalid route', (done) => {
      chai.request(app)
        .get('/api/v2/auth/signup')
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('Signup', () => {
    it('should signup a user on correct input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          userToken = res.body.data.token;
          done();
        });
    });

    it('should return an error on bad input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return an error when a user attempts to sign-up with the same email twice', (done) => {
      chai.request(app)
        .post('/api/v2/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('Login', () => {
    it('should not signin a user on incorrect input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin a user that does not exist', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should signin a user that exist with correct input', (done) => {
      chai.request(app)
        .post('/api/v2/auth/login')
        .send(users[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(202);
          userToken = res.body.data.token;
          done();
        });
    });
  });

  describe('Messages', () => {
    it('should fetch all received emails for a user', (done) => {
      chai.request(app)
        .get('/api/v2/messages')
        .set({ authtoken: userToken })
        .end((err, res) => {
          expect(res.body.data.length).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should fetch all sent emails for a user', (done) => {
      chai.request(app)
        .get('/api/v2/messages')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should fetch all unread received emails for a user', (done) => {
      chai.request(app)
        .get('/api/v2/messages/unread')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should respond with a specific message on valid message id', (done) => {
      chai.request(app)
        .get('/api/v2/messages/4')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should response with an error on non existing id', (done) => {
      chai.request(app)
        .get('/api/v2/messages/53')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should not respond with a specific message on invalid message id', (done) => {
      chai.request(app)
        .get('/api/v2/messages/oiij')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.body.data).to.equal(undefined);
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should respond with an error with undefined token', (done) => {
      chai.request(app)
        .get('/api/v2/messages/98')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should create/send a message with valid data', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .set('authtoken', userToken)
        .send(text[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not create/send a message with invalid email', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .set('authtoken', userToken)
        .send(text[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should delete a mail that exist', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/4')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should respond with an error when trying to delete a non existing mail', (done) => {
      chai.request(app)
        .delete('/api/v2/messages/2')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('Groups', () => {
    it('should not get a group that does not exist', (done) => {
      chai.request(app)
        .get('/api/v2/groups')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should create a group', (done) => {
      chai.request(app)
        .post('/api/v2/group')
        .set('authtoken', userToken)
        .send(group[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should return an error on invalid input', (done) => {
      chai.request(app)
        .post('/api/v2/group')
        .set('authtoken', userToken)
        .send(group[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should get all groups', (done) => {
      chai.request(app)
        .get('/api/v2/groups')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should edit the name of a group', (done) => {
      chai.request(app)
        .patch('/api/v2/groups/2/name')
        .set('authtoken', userToken)
        .send(group[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should delete a group that exist', (done) => {
      chai.request(app)
        .delete('/api/v2/groups/2')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should respond with an error when trying to delete a non existing group', (done) => {
      chai.request(app)
        .delete('/api/v2/groups/3')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should create a new group', (done) => {
      chai.request(app)
        .post('/api/v2/group')
        .set('authtoken', userToken)
        .send(group[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should add users to the new group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/3/users')
        .set('authtoken', userToken)
        .send(group[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should not add a users that already exist in a group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/3/users')
        .set('authtoken', userToken)
        .send(group[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should not add a user with invalid email', (done) => {
      chai.request(app)
        .post('/api/v2/groups/2/users')
        .set('authtoken', userToken)
        .send(group[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should delete a user from a specific group', (done) => {
      chai.request(app)
        .delete('/api/v2/groups/3/users/1')
        .set('authtoken', userToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should send message to all users in a specific group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/3/messages')
        .set('authtoken', userToken)
        .send(group[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should add a new user to a group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/3/users')
        .set('authtoken', userToken)
        .send(group[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should send message to all users in a specific group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/3/messages')
        .set('authtoken', userToken)
        .send(group[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should add a new user to a group', (done) => {
      chai.request(app)
        .post('/api/v2/groups/3/users')
        .set('authtoken', userToken)
        .send(group[6])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should send message to all users in a specific group again', (done) => {
      chai.request(app)
        .post('/api/v2/groups/3/messages')
        .set('authtoken', userToken)
        .send(group[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });
  describe('Authentication', () => {
    it('should not get a specific message with unauthorized id', (done) => {
      chai.request(app)
        .post('/api/v2/messages')
        .set('authtoken', 'jhosjfhaojfhoa')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
  });
});
