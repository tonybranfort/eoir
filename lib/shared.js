/*jslint node: true */
'use strict';

/** 
  * module for shared eoir functions
  * @module 
  */

const puppeteer = require('puppeteer');
const pfns = require('./pfns.js');

// const _ = require('lodash');

const eoirBaseUrl = 'https://portale.eoir.justice.gov';

const selectors = {
};

module.exports = {
  getBaseHrefSig: getBaseHrefSig,
  getBaseSigUrl: getBaseSigUrl,
  gotoSigPage: gotoSigPage,
};


/** returns eoir href through unique sig
  * https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c489ab4948/uniquesig0/
  * @param {String} href
  * @returns {String}
**/
function getBaseHrefSig(href) {
  return href.substr(0, href.indexOf('/uniquesig0')) + '/uniquesig0';
}

/** returns eoir base url through unique sig using the current page url; s/b logged in and accepted disclaimer
  * https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c489ab4948/uniquesig0/
  * @param {Page} page
  * @returns {String}
  * @example
  *   // returns 'https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c489ab4948/uniquesig0'
  *   getBaseSigUrl(page);
**/
function getBaseSigUrl(page) {
  return getBaseHrefSig(page.url());
}

/** page.goto(getBaseSigUrl + href)
  * @param {Page} page
  * @param {String} href Such as '/cases' or '/cases/7153245'
  * @returns {Promise} resolves when networkidle
**/ 
function gotoSigPage(page, href) {
  href = href[0] === '/' ? href : '/' + href;
  return page.goto(getBaseSigUrl(page)+ href, {waitUntil: 'networkidle'});
}
