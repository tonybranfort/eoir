/** tests for eoir login and navigation
**/

let should = require('should'); 
let fs = require('fs');

let eoirLogin = require('../lib/login.js'); 
let eoirHome = require('../lib/home'); 
const pfns = require('../lib/pfns.js');

let config;
getConfig(); 

function getConfig() {
  config = JSON.parse(fs.readFileSync('test/test-config.json', 'utf8'));
}

describe('eoir pfns',function(){
  this.timeout(50000); 

  let page; 

  it('should get a browser page and login user', function() {
    return pfns.getNewBrowserPage({headless: false, slowMo: 100})
    .then((p) => {
      page = p;
      return eoirLogin.login(page, config.loginCreds);
    });
  }); // end of it

  it('should retrieve an element within nested iframes', function() {
    let myCasesLink =  [
      'main_frame', 
      'main_iframe', 
      'a#TilesViewApplicationList1_appDataList_ctl00_appItemLink'];

    return eoirHome.gotoHome(page)
    .then(() => pfns.getEl(page, myCasesLink))
    .then((el) => {
      // console.log(el);
      return (el === null).should.equal(false);
      // return page.waitFor(5000);
    });

  });

});
