/*jslint node: true */
'use strict';

/** 
  * module for puppeteer add-on functions for eoir
  * @module 
  */

const puppeteer = require('puppeteer');
const EventEmitter = require('events');
const _ = require('lodash');

/** Page class as defined by puppeteer 
  * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page
  * @typedef {Class} Page
**/ 


module.exports = {
  getNewBrowser: getNewBrowser,
  getNewBrowserPage: getNewBrowserPage,
  getEl: getEl,
  gotoFrame: gotoFrame,
  checkValidResponse: checkValidResponse, 
  enterValue: enterValue,
  waitForIdle: waitForIdle,
  clickAndWait: clickAndWait,
  select: select,
  isChecked: isChecked,
  scrapeIt: scrapeIt
};

/** = puppeteer.launch; returns browser instance
  * @see {@link https://github.com/GoogleChrome/puppeteer/blob/v0.11.0/docs/api.md#puppeteerlaunchoptions}
  * 
**/
function getNewBrowser(options) {
  return puppeteer.launch(options);
}


/** return a new browser page
  * @param {Object} options - options object as defined by https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  * @returns {Promise<Page>}
**/ 
function getNewBrowserPage(options) {
  return puppeteer.launch(options)
  .then((browser) => {
    return browser.newPage();
  });
}

/** check valid response; throw error with response if note
  * @param {Response} response
  * @returns {Response|Error<response>}
**/ 
function checkValidResponse(response) {
  if(response.status !== 200) {
    throw new Error(response);
  } else {
    return; 
  }
}

/** enter a value in an input element
  * @param {Page} page
  * @param {Promise} elP - Promise that resolves to an element handler
  * @param {String|Number} value - value to enter 
  * @returns {Promise<Page|Error<Response>>}
**/ 
function enterValue(page, elP, value) {
  // console.log(elP);
  return elP
  .then((inputEl) => {
    return inputEl.click();
  })
  .then(() => {
    return page.type(value);
  })
  .then(() => {
    return page; 
  }); 

}

/** goes through all frames in page and returns frame with name requested
  * @param {page}
  * @param {String} frameName
  * @returns {Frame|foundFrame}
**/ 
function getFrame(page, frameName) {
  // console.log('getFrame ' + frameName);
  var foundFrame; 

  dumpFrameTree(page.mainFrame(), '');

  function dumpFrameTree(frame, indent) {
    // console.log(indent + frame.name() + '  : ' + frame.url());
    if(frame.name().trim() === frameName) {
      foundFrame = frame; 
    } else {
      for (let child of frame.childFrames()) {
        dumpFrameTree(child, indent + '  ');
      }
    }
  }

  return foundFrame; 
}

/** get url of frame and goto that url
  * @param {page} page
  * @param {String | Array<String>} frames; frame name or array of frame names
  * @param {Promise|undefined} p - a promise to wait for
  * @returns <Promise>
**/ 
function gotoFrame(page, frames, p) {
  frames = _.isArray(frames) && frames.length === 1 ? frames[0] : frames; 
  p = p ? p : new Promise((resolve) => {resolve();});
  let frameNameToGet = _.isString(frames) ? frames : frames[0];
  let frame = getFrame(page, frameNameToGet);
  let frameUrl = frame.url();
  // console.log(frameNameToGet);
  // console.log(frameUrl);

  if(_.isString(frames)) {
    return p
    .then(() => {
      return page.goto(frameUrl, {waitUntil: 'networkidle'});
    });
  } else {
    let l = p.then(() => { 
        return page.goto(frameUrl, {waitUntil: 'networkidle'});
      });
    frames.splice(0,1);
    return gotoFrame(page, frames, l);
  }
}

/** retrieve an element handler given either a selector string or a selector obj
  * @param {Page} page
  * @param {String|Array.<String>} selectors - if array, then in order of frame name with last being elementselector string
  * @returns {Promise<ElementHandler>}
  * @example 
  *  // returns Promise resolving to element #myelid in main_frame in main_iframe
  *  getEl(page, ['main_frame', 'main_iframe', '#myelid']) 
**/ 
function getEl(page, selectors) {
  // EXAMPLE getEl(page, ['main_frame', 'main_iframe', '#myelid'])

  // cut last string off array and assign as elSelector if array eg '#myelid'
  let elSelector = _.isString(selectors) ? selectors : selectors.splice(-1);  

  // if still elements in array, then those are the frame names; eg ['main_frame', 'main_iframe']
  let frameNames = _.isArray(selectors) && selectors.length > 0 ? 
    selectors : undefined; 

  if(frameNames) {
    return gotoFrame(page, frameNames)
    .then(() => {
      return page.$(elSelector);
    });
  } else {
    return new Promise((resolve) => {
      resolve(page.$(elSelector));
    });
  }

}

/** runs puppeteer page.click and then waits for network idle
  @param {Page} page
  @param {String} selector
  @returns {Promise}
**/ 
function clickAndWait(page, selector) {
  // console.log(selector);
  return page.click(selector)
  .then(() => {return waitForIdle(page);});
}

/** wait for page to network idle
  @param {Page} page
  @returns {Promise}
**/ 
function waitForIdle(page) {
  // console.log('waitForIdle');
  return page.waitForNavigation({waitUntil: 'networkidle'}); 
}

/** select an item in an html select dropdown
  * @see {@link https://stackoverflow.com/questions/45864516/how-to-select-an-option-from-dropdown-select}
  * @todo Replace with page.select when Puppeteer v.12 is released
  * @param {Page} page
  * @param {String} selector
  * @param {!Array<string>} values
  * @returns {Promise}
**/ 
function select(page, selector, ...values) {
  return page.$eval(selector, (element, values) => {
    if (element.nodeName.toLowerCase() !== 'select')
      throw new Error('Element is not a <select> element.');

    const options = Array.from(element.options);

    if (element.multiple) {
      for (const option of options)
        option.selected = values.includes(option.value);
    } else {
      element.value = values.shift();
    }

    element.dispatchEvent(new Event('change'));
    element.dispatchEvent(new Event('input'));
  }, values);
}

/** return if the input radio is selected
  * @param{Page} page
  * @param{String} selector - input selector (without :checked)
  * @returns{Promise<Boolean>}
  * 
**/ 
function isChecked(page, selector) {
  let checkedSelector = selector + ':checked';
  return page.$(checkedSelector)
  .then((el) => {
    return el === null ? false : true;
  });
}

/** 
  * @typedef {Array<Scrape>} Scrapes
**/ 

/** 
  * @typedef {Object} Scrape
  * @param {Selector} selector
  * @param {String} path Path in dot notation. '[]' in path will be replaced with [idx] 
  * @param {Function} getValue Function that takes an ElementHandle found at selector and resolves to value to be assigned to path
  * @param {Function|undefined} transformValue Function to process result of getValue
**/ 

/** scrape data from page into object using Scrape
  * @param {Page} page
  * @param {Scrapes} scrapes
  * @param {Object|undefined} ro The object to be updated and returned
  * @returns {Promise<Object>} returns updated ro Object with props filled in with values
  * @example Non array path
  *  // returns Promise resolving to {gottaName: "Johnny"}
  *  scrapeIt(page, [{selector: 'input#name', path:'date', getValue: (elH) => elH.value}])
  * @example With transformValue
  *  // returns Promise resolving to {date: 1975-05-01T05:00:00.000Z}
  *  scrapeIt(page, [
  *   {selector: 'div#dateStr', 
  *     path:'dateOf', 
  *     getValue: (elH) => elH.value
  *     transformValue: (val) => new Date(val)}])
  * @example Array path
  *  // returns Promise resolving to {names:[{gottaName: "Johnny"}, {gottaName: "Jarvia"}]}
  *  scrapeIt(page, [{selector: 'input#names tr td', path:'names[].gottaName', getValue: (elH) => elH.innerHTML}])
  *  
**/ 
function scrapeIt(page, scrapes, ro={}) {
  var ps = [];

  scrapes.forEach((scrape) => {
    if(scrape.path.indexOf('[]') > -1) {
      ps.push(scrapeIt$$(page, scrape, ro));
    } else { 
      ps.push(scrapeIt$(page, scrape, ro));
    }
  });

  return Promise.all(ps)
  .then(() => ro);
}

/** scrape one element and assign to object following 
  * @param {Page} page
  * @param {Scrape} scrape
  * @param {Object|undefined} ro
  * @returns {Promise<Object|Error>}
**/ 
function scrapeIt$(page, scrape, ro={}) {
  return page.$(scrape.selector)
  .then((elH) => page.evaluate(scrape.getValue, elH))
  .then((val) => scrape.transformValue ? scrape.transformValue(val) : val)
  .then((val) => _.set(ro, scrape.path, val)); 
}

/** scrape multiple ($$) elements and assign to object in array
  * @param {Page} page
  * @param {Scrape} scrape
  * @param {Object|undefined} ro
  * @returns {Promise<Object|Error>}
**/ 
function scrapeIt$$(page, scrape, ro={}) {
  // eg path: "proceedings[].nbr" =>  {proceedings: [{nbr:0}, {nbr:1}]}
  return page.$$(scrape.selector)
  .then((elHs) => {
    let ps = [];
    elHs.forEach((elH, idx) => {
      let path = scrape.path.replace('[]','[' + idx + ']'); // eg "proceedings[0].nbr"
      ps.push(
        page.evaluate(scrape.getValue, elH)
        .then((val) => scrape.transformValue ? scrape.transformValue(val) : val)
        .then((val) => _.set(ro, path, val))
      );
    });
    return Promise.all(ps);
  });
}
