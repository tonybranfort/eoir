/** tests for eoir cases
**/ 

let should = require('should'); 
let fs = require('fs');

const pfns = require('../lib/pfns.js');
let eoirLogin = require('../lib/login.js'); 
let eoirCase = require('../lib/case.js'); 
let eoirCaseList = require('../lib/case-list.js'); 
const utils = require('../lib/utils');

let config;
getConfig(); 

function getConfig() {
  config = JSON.parse(fs.readFileSync('test/test-config.json', 'utf8'));
}

config.testCases.forEach(testCase => {
  testCase.chargingDocDate.date = toDate(testCase.chargingDocDate.date);
  testCase.proceedings.forEach((proceeding) => {
    proceeding.decisionDate.date = toDate(proceeding.decisionDate.date);
  });
  testCase.hearings.forEach((hearing) => {
    hearing.date.date = toDate(hearing.date.date);
  });
}); 

function toDate(d) {
  return d ? new Date(d) : d;
}


describe('eoir case',function(){
  this.timeout(50000); 

  let page; 

  it('should get a browser page and login user', function() {
    return pfns.getNewBrowserPage({headless: false, slowMo: 100})
    .then((p) => {
      page = p;
      return eoirLogin.login(page, config.loginCreds);
    });
  }); // end of it

  it('should go to a case', function() {
    let id; 

    return eoirCase.gotoCase(page, config.testCases[0].eoirId)
    .then(() => pfns.getEl(page, eoirCase.selectors.aNbr))
    .then((aNbrEl) => (aNbrEl === null).should.equal(false));
    // .then(() => page.waitFor(10000))
    // .then(() => 'abc'.should.equal('abc'));

  }); 

  config.testCases.forEach(validateCase);

  function validateCase(testCase) {
    it('should get the case detail data for ' + testCase.eoirId, () => {
      return eoirCase.getCaseData(page, testCase.eoirId)
      .then((caseObj) => {
        // console.log(caseObj);
        let d = utils.getDiffs(testCase, caseObj);
        if(d.length > 0 ) {console.log(d);}
        d.length.should.equal(0);
      });
    });
  }

});


