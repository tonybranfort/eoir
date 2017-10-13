/** tests for eoir login and navigation
**/

let should = require('should'); 
let eoirLogin = require('../lib/login.js'); 
const pfns = require('../lib/pfns.js');
let fs = require('fs');

let config;
getConfig(); 

function getConfig() {
  config = JSON.parse(fs.readFileSync('test/test-config.json', 'utf8'));
}

describe('eoir login',function(){
  this.timeout(50000); 

  let page; 

  it('should get a browser page', function() {
    return pfns.getNewBrowserPage({headless: false, slowMo: 100})
    .then((p) => {
      page = p;
    });
  }); // end of it


  it('isLoggedIn should return false if not logged in', function() {
    return eoirLogin.isLoggedIn(page)
    .then((isIt) => {
      return isIt.should.equal(false);
    });
  });

  it('should log in a user', function() {
    return eoirLogin.login(page, config.loginCreds)
    .then((p) => {
      // return p;
      // console.log('back from login');
      return eoirLogin.isLoggedIn(page);

    })
    .then((isIt) => {
      // console.log('isIt : ' + isIt);
      return isIt.should.equal(true);
    });

  });

});
