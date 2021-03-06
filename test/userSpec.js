// require('babel-core/register');
require('dotenv').load();

const expect = require('chai').expect;
const request = require('supertest');
const _ = require('lodash');


module.exports = function runUserApiTests(app, defUser, dbType="mongo") {

  let baseUrl = null;
  let userUpdate = null;
  let emailUpdate = "fromMoch2a@jocha.com";

  (dbType === "mongo")
    ? baseUrl='api'
    : baseUrl='apisql';
    
  (dbType === "mongo")
    ? userUpdate = { local: { email: emailUpdate } }
    : userUpdate = { email: emailUpdate };

  // import common functions
  const testCreateUser = require('./commonTest/commonUserTest')(app, baseUrl).createUser;
  const testReadUser = require('./commonTest/commonUserTest')(app, baseUrl).readUser;
  const testDeleteUser = require('./commonTest/commonUserTest')(app, baseUrl).deleteUser;

  let userId = undefined;

/*   beforeEach (() => {
    console.log(baseUrl);
  }); */

  it("GETS health check", function (done) {
    request(app)
      .get(`/${baseUrl}/health-check`)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) done(new Error(res.text));
        done();
      });
  });
  it("GETS All Users", function (done) {
    request(app)
      .get(`/${baseUrl}/users`)
      .expect(200)
      .end(function (err, res) {
        if (err) done(new Error(res.text));
        done();
      });
  });
  it("CREATE One User", function (done) {
    testCreateUser(defUser)
      .then((id) => {
        userId = id;
        done();
      })
      .catch(err => done(err));

  });
  it("READ One User", function (done) {
    testReadUser(userId)
      .then(() => done())
      .catch(err => done(err));
  });
  it("UPDATE One User", function (done) {
    
    // console.log(userId);
    // console.log(userUpdate);
    request(app)
      .put(`/${baseUrl}/users/${userId}`)
      .set('Accept', 'application/json')
      .send(userUpdate)
      .expect(200)
      .end(function (err, res) {
        if (err) done(new Error(res.text));
        if (dbType === "mongo"){
          expect(JSON.parse(res.text)._id).to.equal(userId);
          expect(JSON.parse(res.text).local.email).to.equal(emailUpdate);
        } else {
          expect(JSON.parse(res.text)._id).to.equal(userId);
          expect(JSON.parse(res.text).email).to.equal(emailUpdate);
        }
        done();
      });
  });
  it("DELETE One User", function (done) {
    testDeleteUser(userId)
      .then(() => done())
      .catch(err => done(err));
  });
};

