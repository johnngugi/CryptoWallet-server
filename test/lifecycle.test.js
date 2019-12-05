const chai = require('chai');
const Chance = require('chance');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../app');

global.app = app;
global.chance = new Chance();
global.chai = chai;
global.expect = chai.expect;
global.should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-as-promised'));

const port = 3001;
app.set('port', port);
let server = http.createServer(app);

before((done) => {
    server.listen(port, (err) => {
        if (err) { return done(err); }
        return done();
    });
});

after((done) => {
    server.close(done);
});
