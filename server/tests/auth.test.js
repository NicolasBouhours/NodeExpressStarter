const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../../index');

const { expect } = chai;

chai.config.includeStack = true;

/**
 * root level hooks
 */
before((done) => {
  const User = mongoose.model('User');
  User.remove({}, () => {});
  done();
});

after((done) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Auth', () => {
  const user = {
    email: 'test@email.fr',
    password: 'password1234',
    firstName: 'Martin',
    lastName: 'Antoine'
  };

  describe('# POST /api/auth/register', () => {
    it('should return OK', (done) => {
      request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/register', () => {
    it('should return error for existing user ', (done) => {
      request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('This email already exist');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/register', () => {
    it('should return error for empty email ', (done) => {
      request(app)
        .post('/api/auth/register')
        .send({
          email: '',
          password: 'password1234',
          firstName: 'Martin',
          lastName: 'Antoine'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.have.string('"email"');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/register', () => {
    it('should return error for empty password ', (done) => {
      request(app)
        .post('/api/auth/register')
        .send({
          emaill: 'test@email.fr',
          password: '',
          firstName: 'Martin',
          lastName: 'Antoine'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.have.string('"password"');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/register', () => {
    it('should return error for empty firstName ', (done) => {
      request(app)
        .post('/api/auth/register')
        .send({
          emaill: 'test@email.fr',
          password: '4455dzdzede',
          firstName: '',
          lastName: 'Antoine'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.have.string('"firstName"');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/register', () => {
    it('should return error for empty lastName ', (done) => {
      request(app)
        .post('/api/auth/register')
        .send({
          emaill: 'test@email.fr',
          password: 'dedededed',
          firstName: 'Martin',
          lastName: ''
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.have.string('"lastName"');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should sign in a user ', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.exist; // eslint-disable-line no-unused-expressions
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should not sign in a user ', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          'email': 'test@test.fr',
          'password': 'badpassword'
        })
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Unknow user');
          done();
        })
        .catch(done);
    });
  });
});
