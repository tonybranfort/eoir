/*jslint node: true */
'use strict';

/** 
  * module for eoir login and basic navigation
  * @module 
  */

const puppeteer = require('puppeteer');
const pfns = require('./pfns.js');
const eoirHome = require('./home.js');
const caseList = require('./case-list.js');

const _ = require('lodash');

const selectors = {
  loginIdInput : 'input#user_name',
    // page.mainFrame: <input class="paramTextbox" type="text" id="user_name" name="user_name"...
  loginPwInput : "input#password",
    // page.mainFrame: <input class="paramTextbox" type="password" id="password" name="password"...
  loginSubmitButton: "input#submit_button",
    // <input border="0" class="button" type="submit" id="submit_button" value="Login">
  // logoffButton: 'a .ctl00_toolBar1_logoutMenu_1'
};

module.exports = {
  selectors: selectors, 
  login: login,
  isLoggedIn: isLoggedIn,
  logoff: logoff
};

/** eoir login credentials (id, pw) object
  * @typedef {Object} LoginCreds
  * @param {String} id
  * @param {String} pw
**/ 


/** log into eoir site; assumes user is logged off
  * @param {Page} page
  * @param {LoginCreds} 
  * @returns {Promise<Page|Error>} Throws error if login not successful
**/ 
function login(page, loginCreds) {
  // console.log('login');

  return eoirHome.gotoHome(page)
  .then(() => {
    return pfns.enterValue(page, pfns.getEl(page, selectors.loginIdInput), loginCreds.id);
  })
  .then(() => {
    return pfns.enterValue(page, pfns.getEl(page, selectors.loginPwInput), loginCreds.pw);
  })
  .then(() => {return pfns.getEl(page, selectors.loginSubmitButton);})
  .then((submitEl) => {
    return submitEl.click();
  })
  .then(() => {
    return page.waitForNavigation({waitUntil: 'networkidle'});
  })
  .then(() => isLoggedIn(page))
  .then(isLI => {
    if(!isLI) {throw new Error("Login failure");}
  })
  .then(() => {
    // accept disclaimer
    return caseList.gotoMyCases(page);
    // return page; 
  })
  ;

    
}

/** returns true (Promise) if there is a user logged in (no check on which user)
  * @param {Page}
  * @returns {Promise<Boolean|Error>}
**/ 
function isLoggedIn(page) {
  /* <td style="white-space:nowrap;">
      <a class="ctl00_toolBar1_logoutMenu_1 StaticMenuItem ctl00_toolBar1_logoutMenu_3" 
        href="javascript:logoff();" 
        style="border-style:none;font-size:1em;">Log Off </a></td>
  */
  // console.log('isLoggedIn');
  return eoirHome.gotoHome(page)
  .then(() => {
    return page.waitForSelector(selectors.loginIdInput, {timeout: 5000});
  })
  .then(() => {
    // console.log('isLoggedIn then');
    return false; 
  }) 
  .catch((e)=> {
    // console.log('isLoggedIn catch');
    return true;  // login id not found so is logged in
  });

}

/** log user off eoir portal 
**/ 
function logoff() {

  // 1. goto home

  // 2. click Log Off if isLoggedIn()

}
