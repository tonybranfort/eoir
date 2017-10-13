/*jslint node: true */
'use strict';

/** 
  * module for eoir home page
  * @module 
  */

const puppeteer = require('puppeteer');
const pfns = require('./pfns.js');

const eoirHomeUrl = 'https://portale.eoir.justice.gov';
const _ = require('lodash');

const selectors = {
  myCasesLink: [
    'main_frame',   // https://portale.eoir.justice.gov/uniquesig0fac0604b30fa499a20237a1b2f62d54/uniquesig0/SecureUserPortalPortalHomePage/MainFrame.aspx
    'main_iframe',  // https://portale.eoir.justice.gov/uniquesig0fac0604b30fa499a20237a1b2f62d54/uniquesig0/SecureUserPortalPortalHomePage/ContentFrame.aspx
    // '#TilesViewApplicationList1_appDataList_ctl00_appItemLink']
    'a#TilesViewApplicationList1_appDataList_ctl00_appItemLink'],
        // <a href="https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c49a9d9788/uniquesig0/" 
        //    id="TilesViewApplicationList1_appDataList_ctl00_appItemLink" class="TilesView_AppItemLink" 
        //    target="main_iframe">Electronic Case Information</a>
};

module.exports = {
  selectors: selectors, 
  gotoHome: gotoHome,
};

/** go to portal home page https://portale.eoir.justice.gov; wb login page if user is not logged in
  * @param {Page} page
  * @returns {Promise<Page|Error<Response>>} returns Response if status !== 200
**/ 
function gotoHome(page) {
  // console.log('gotoHome()');
  return page.goto(eoirHomeUrl, {waitUntil: 'networkidle'})
  .then(pfns.checkValidResponse)
  .then(() => {
    return page; 
  });

}
  
