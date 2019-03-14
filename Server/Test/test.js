import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import users from './datas/user';
import text from './datas/text';

let userToken;
let userError;

const { expect } = chai;
chai.use(chaihttp);

describe('Epic Test', () => {
  describe('/display welcome message', () => {
    it('display the welcome messqge', (done) => {
      chai.request(app)
        .get('/api/v1/')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to EPic mail');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('POST/auth/signup', () => {
    it('should signup a user on correct input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should return an error on bad input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return an error when a user attempts to sign-up with the same email twice', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/auth/signin', () => {
    it('should not signin a user on incorrect input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin a user that does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should signin a user that exist with correct input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[4])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          userToken = res.body.data.Token;
          done();
        });
    });
  });

  describe('GET/message/received', () => {
    it('should fetch all received emails for a user', (done) => {
      chai.request(app)
        .get('/api/v1/messages/received')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data.length).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('GET/message/unread', () => {
    it('should fetch all unread received emails for a user', (done) => {
      chai.request(app)
        .get('/api/v1/messages/unread')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data.some(message => message.status === 'read')).to.equal(false);
          expect(res.body.data.some(message => message.status === 'unread')).to.equal(true);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('GET/message/sent', () => {
    it('should fetch all sent emails for a user', (done) => {
      chai.request(app)
        .get('/api/v1/messages/sent')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data.some(message => message.status === 'read')).to.equal(false);
          expect(res.body.data.some(message => message.status === 'unread')).to.equal(false);
          expect(res.body.data.some(message => message.status === 'draft')).to.equal(false);
          expect(res.body.data.some(message => message.status === 'sent')).to.equal(true);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('GET/messages/:id', () => {
    it('should respond with a specific message on valid message id', (done) => {
      chai.request(app)
        .get('/api/v1/messages/2')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should response with an error on non existing id', (done) => {
      chai.request(app)
        .get('/api/v1/messages/3')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data).to.equal(undefined);
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not respond with a specific message on invalid message id', (done) => {
      chai.request(app)
        .get('/api/v1/messages/oiij')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data).to.equal(undefined);
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    userError = userToken + 2;
    it('should not get a specific message with unauthorized id', (done) => {
      chai.request(app)
        .get('/api/v1/messages/2')
        .set('authorization', `Bearer ${userError}`)
        .end((err, res) => {
          expect(res.body.data).to.equal(undefined);
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
  });

  describe('POST/compose', () => {
    it('should create/send a message with valid data', (done) => {
      chai.request(app)
        .post('/api/v1/auth/compose')
        .set('authorization', `Bearer ${userToken}`)
        .send(text[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not create/send a message with invalid data', (done) => {
      chai.request(app)
        .post('/api/v1/auth/compose')
        .set('authorization', `Bearer ${userToken}`)
        .send(text[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('DELETE/messages/:id', () => {
    it('should delete a mail that exist', (done) => {
      chai.request(app)
        .delete('/api/v1/messages/2')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should respond with an error when trying to delete a non existing mail', (done) => {
      chai.request(app)
        .delete('/api/v1/messages/2')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.status).to.equal(404);
          done();
        });
    });
  });
});
