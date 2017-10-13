/** tests for eoir cases
**/ 

let should = require('should'); 
let eoirLogin = require('../lib/login.js'); 
let eoirCases = require('../lib/case-list.js'); 
const pfns = require('../lib/pfns.js');
let fs = require('fs');

let config;
getConfig(); 

function getConfig() {
  config = JSON.parse(fs.readFileSync('test/test-config.json', 'utf8'));
}

describe('eoir case-list',function(){
  this.timeout(50000); 

  let page; 

  it('should get a browser page and login user', function() {
    return pfns.getNewBrowserPage({headless: false, slowMo: 100})
    .then((p) => {
      page = p;
      return eoirLogin.login(page, config.loginCreds);
    });
  }); // end of it

  it('should go to my cases', function() {

    return eoirCases.gotoMyCases(page)
    .then(() => {
      return pfns.getEl(page, eoirCases.selectors.recordsPerPageDd);
    })
    .then((el) => {
      (el === null).should.equal(false);
    });

  }); 

  it('should get all case eoir ids', function() {
    let totalCases; 

    return eoirCases.gotoMyCases(page)
    .then(() => 
      pfns.clickAndWait(page, eoirCases.selectors.searchStatusRadioAll))
    .then(() => eoirCases.getCaseListInfo(page))
    .then((caseListObj) => totalCases = caseListObj.total)
    .then(() => eoirCases.getAllEoirIds(page))
    .then((ids) => ids.length.should.equal(totalCases));
    // .then(() => page.waitFor(10000));
  });

});
