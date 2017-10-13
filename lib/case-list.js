/*jslint node: true */
'use strict';

/** 
  * module for eoir case list pages
  * @module 
  */

const puppeteer = require('puppeteer');
const pfns = require('./pfns.js');
const eoirHome = require('./home.js');
const eoirShared = require('./shared.js');

const _ = require('lodash');

const selectors = {
  acceptDisclaimerButton: 'input[name="agree"]', 
    // page.mainFrame: <input type="submit" class="btn btn-default" name="agree" value="Agree">
    // https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c49a9d9788/uniquesig0/Home/Disclaimer
  searchStatusRadioAll: 'input[name="case-list-basic-search-status-value"][value="All"]',
    // <input name="case-list-basic-search-status-value" type="radio" autocomplete="off" value="All">  
  recordsPerPageDd: 'select[name="case-list-table_length"]',
    //<select name="case-list-table_length" aria-controls="case-list-table" class="form-control input-sm"><option value="5">5</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>    
  recordsPerPageDdSelect100: 'select[name="case-list-table_length"] option[value="100"]',
    // recordsPerPageDdSelect100: 'select[name="case-list-table_length"] option[value="100"]'
    // <option value="100">100</option>
  detailsButton: '#case-list-table a[href^="cases"]',
    // <a class="btn btn-primary" href="cases/9999999">Details</a>
  caseListInfo: 'div#case-list-table_info',
    // <div class="dataTables_info" id="case-list-table_info" role="status" aria-live="polite">Showing 1 to 100 of 313 entries</div>
  nextButton: '#case-list-table_next a'
    // <li class="paginate_button next" aria-controls="case-list-table" tabindex="0" id="case-list-table_next"><a href="#">Next</a></li>
};

module.exports = {
  selectors: selectors, 
  gotoMyCases: gotoMyCases,
  getAllEoirIds: getAllEoirIds,
  getCaseListInfo: getCaseListInfo
};



/** go to the My Cases page on the eoir site; assumes is logged in, returns Error if not. Will accept disclaimer if needed. 
  * @param {Page<page|Error>}
  * @returns {Promise<Response>} 
**/
function gotoMyCases(page) {
  // console.log('gotoMyCases');
  return isOnMyCasesPage(page)
  .then((isMyCasesPage) => {
    if(isMyCasesPage) {
      return; 
    } else {
      return navToMyCases();
    }
  });

  function navToMyCases() {
    return eoirHome.gotoHome(page)
    .then(() => {
      // console.log('    back from gotoHome');
      return pfns.getEl(page, eoirHome.selectors.myCasesLink);
    })
    .then((el) => { 
      // get href of myCasesLink and manually go to that page
      //   cannot click it because it will open in a different tab
      return page.evaluate((sel) => {
          return sel.href;
        }, el);
    })
    .then((caseLinkHref) => {
      let acceptHref = 
        eoirShared.getBaseHrefSig(caseLinkHref) + '/Home/Disclaimer';
      // even if already accepted, can still go to accept page and continue
      return page.goto(acceptHref, {waitUntil: 'networkidle'});
    })
    .then(() => pfns.clickAndWait(page, selectors.acceptDisclaimerButton));
  }
}

/** detrermine if page is my cases page
**/ 
function isOnMyCasesPage(page) {
  return pfns.getEl(page, selectors.recordsPerPageDd)
  .then((el) => {
    return el === null ? false : true; 
  });
}

/** get all eoir ids by checking all cases on the eoir portal; assumes is logged in 
  * @param {Page} page
  * @returns {Promise<Array<eoirId>|Error>}
  * 
**/ 
function getAllEoirIds(page, ids=[]) {
  // let ids = [];
  // let numberOfCases; 
  return gotoMyCases(page)
  .then(() => pfns.isChecked(page, selectors.searchStatusRadioAll))
  .then((checked) => {
    if(!checked) {
      return pfns.clickAndWait(page, selectors.searchStatusRadioAll);
    }
  })
  .then(() => pfns.isChecked(page, selectors.recordsPerPageDdSelect100))
  .then((checked) => {
    if(!checked) {
      return pfns.select(page, selectors.recordsPerPageDd, '100')
      .then(() => pfns.waitForIdle(page));
    }
  })
  .then(() => getIdsFromPage(page))
  .then((newIds) => ids = ids.concat(newIds))
  .then(() => getCaseListInfo(page))
  .then((infoObj) => {
    if(infoObj.to !== infoObj.total) {
      return pfns.clickAndWait(page, selectors.nextButton)
      .then(() => getAllEoirIds(page, ids));
    } else {
      return ids; 
    }
  })
  .catch((e) => {console.log(e);});

  /** get all eoir ids from class list page 
    * @param {Page} page
    * @returns {Promise<Array.String>} array of ids
  **/ 
  function getIdsFromPage(page) {
    return page.$$(selectors.detailsButton)
    .then((els) => {
      let ps = []; 
      // return page.evaluate((detailsButton) => detailsButton.href, els[0]);
      let ids = [];
      els.forEach((el) => {
        let p = page.evaluate((detailsButton) => {
          return detailsButton.href;
        }, el)
        .then((href) => ids.push(getIdFromHref(href)) );
        ps.push(p);
      });
      return Promise.all(ps)
      .then(() => ids); 
    })
    .catch((e) => console.log(e));
  }

  /** return eoir id from an href of form 'https://portale.eoir.justice.gov/.../uniquesig0/cases/8013836'
    * @pararm {String} href
  **/ 
  function getIdFromHref(href) {
    try {
      return href.substr(href.indexOf('/cases/')+ 7);
    } catch(e) {
      throw e; 
    }
  }

}

/** 
  * @typedef {Object} CaseListInfo
  * @property {Number} from The starting point of case list being viewed
  * @property {Number} to The ending point of case list being viewed
  * @property {Number} total The total number of cases in case list being viewed
**/ 



/** returns number of cases as indicated on case list page
  * @param {Page} page
  * @returns {CaseListInfo}
**/ 
function getCaseListInfo(page) {
  let re = /Showing\ ([0-9]*)\ to\ ([0-9]*)\ of\ ([0-9]*)\ entries/;
  let from; 
  let to;
  let total; 
  // "Showing (from) to (to) of (total) entries" 
  let caseListInfoObj = {};

  return gotoMyCases(page)
  .then(() => page.$(selectors.caseListInfo))
  // return page.$(selectors.caseListInfo)
  .then((el) => {
    return page.evaluate((caseListInfoEl) => {
      return caseListInfoEl.innerText;
    }, el); 
  })
  .then((txt) => {
    let r = re.exec(txt);
    // console.log(txt);
    /*[ 'Showing 1 to 5 of 313 entries',
            '1',
            '5',
            '313',
            index: 0,
            input: 'Showing 1 to 5 of 313 entries' ]    */
    caseListInfoObj.from = Number(r[1]);
    caseListInfoObj.to = Number(r[2]);
    caseListInfoObj.total = Number(r[3]);
    // console.log(caseListInfoObj);
    return caseListInfoObj;
  });
}
