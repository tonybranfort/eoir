/*jslint node: true */
'use strict';

/** 
  * module for eoir case 
  * @module 
  */

/** case data object
  * @typedef {Object} CaseDetails
  * @param {String} eoirId
  * @param {String} aNbr
  * @param {String} aNbrStrip The aNbr stripped of all chars except [0-9]
  * @param {Object} chargingDocDate
  * @param {String} chargingDocDate.orig "mm/dd/yyyy"
  * @param {Date}   chargingDocDate.date  new Date(orig).setUTCHours(18)
  * @param {String} alienName
  * @param {String} hearingLocation
  * @param {String} caseStatus
  * @param {String} clock
  * @param {Array<Hearing>} hearings
  * @param {Array<Proceeding>} proceeding
**/ 

/** hearing data object
  * @typedef {Object} Hearing
  * @param {String} type
  * @param {Object} date
  * @param {String} date.origDate
  * @param {Date}   date.date  new Date(orig).setUTCHours(18)
  * @param {String} date.origTime
  * @param {String} date.timeFrom
  * @param {String} date.timeTo
  * @param {Object} location
  * @param {String} location.addr1
  * @param {String} location.cityStateZip
  * @param {String} iJAssigned

**/

/** proceeding data object
  * @typedef {Object} Proceeding
  * @param {String} sortNbr
  * @param {Object} decisionDate
  * @param {String} decisionDate.orig
  * @param {Date}   decisionDate.date  new Date(orig).setUTCHours(18)
  * @param {String} iJDecision
  * @param {Object} hearingLocation
  * @param {String} hearingLocation.addr1
  * @param {String} hearingLocation.cityStateZip
**/ 

const puppeteer = require('puppeteer');
const _ = require('lodash');
const assert = require('assert'); 

const pfns = require('./pfns.js');
const eoirShared = require('./shared.js');

// const _ = require('lodash');

const selectors = {
  aNbr: 'input#a-number',
    // <input id="a-number" type="text" class="form-control" value="999-888-777" readonly="">
  chargingDocDate: 'input#charging-doc-date',
    // <input id="charging-doc-date" type="text" class="form-control" value="06/27/2016" readonly="">
  alienName: 'input#alien-name',
    // <input id="alien-name" type="text" class="form-control" value="SOMEBODY, NAME " readonly="">
  hearingLocation: 'textarea#hearing-location',
    // <textarea id="hearing-location" class="form-control" rows="5" readonly="">
    // IMMIGRATION COURT
    // 1 FEDERAL DRIVE, SUITE 1850
    // FORT SNELLING, MN 55111
    // (612) 725-3765
    // </textarea>
  caseStatus: 'input#case-status',
    // <input id="case-status" type="text" class="form-control" value="Pending" readonly="">
  clock: 'input#clock',
    // <input id="clock" type="text" class="form-control" value="No Clock" readonly="">
  proceedings: {
    selector: 'table#case-detail-proceedings-table tr',
    sortNbr: 'td:nth-child(2)', 
    decisionDate: 'td:nth-child(3)', 
    iJDecision: 'td:nth-child(4)', 
    hearingLocationAddr1: 'td:nth-child(5) div:nth-child(1)',
    hearingLocationCityStateZip: 'td:nth-child(5) div:nth-child(2)'
      // <td>
      //     <div>566 VETERAN DRIVE., SUITE 101</div>
      //     <div>PEARSALL, TX 78061</div>                
      // </td>
  },
  hearings: {
    selector: 'table#case-detail-future-hearings-table tr',
      //<table id="case-detail-future-hearings-table" class="table dataTable no-footer" role="grid">
    type: 'td:nth-child(1)', 
    date: 'td:nth-child(2)', 
    time: 'td:nth-child(2) span', 
      //<td>03/23/2020 <span style="white-space:nowrap">(01:00 PM - 05:00 PM)</span></td>
    locationAddr1: 'td:nth-child(3) div:nth-child(1)',
    locationCityStateZip: 'td:nth-child(3) div:nth-child(2)',
    iJAssigned: 'td:nth-child(4)', 

  }
};

const caseDetailScrapes = [
  {path: 'aNbr',
   selector: selectors.aNbr,
   getValue: (elH) => elH.value 
  },
  {path: 'aNbrStrip',
   selector: selectors.aNbr,
   getValue: (elH) => elH.value,
   transformValue: (val) => val.replace(/[^\d]/g,'')
  },
  {path: 'chargingDocDate.orig',
   selector: selectors.chargingDocDate,
   getValue: (elH) => elH.value 
  },
  {path: 'chargingDocDate.date',
   selector: selectors.chargingDocDate,
   getValue: (elH) => elH.value,
   transformValue: toDateUTC18
  },
  {path: 'alienName',
   selector: selectors.alienName,
   getValue: (elH) => elH.value 
  },
  {path: 'hearingLocation',
   selector: selectors.hearingLocation,
   getValue: (elH) => elH.value 
  },
  {path: 'caseStatus',
   selector: selectors.caseStatus,
   getValue: (elH) => elH.value 
  },
  {path: 'clock',
   selector: selectors.clock,
   getValue: (elH) => elH.value 
  },

  /********* proceedings ****************/
  {path: 'proceedings[].sortNbr',
   selector: selectors.proceedings.selector + ' ' +
      selectors.proceedings.sortNbr,
   getValue: (elH) => elH.innerHTML
  },

  {path: 'proceedings[].decisionDate.orig',
   selector: selectors.proceedings.selector + ' ' + 
      selectors.proceedings.decisionDate,
   getValue: (elH) => elH.innerHTML
  },
  {path: 'proceedings[].decisionDate.date',
   selector: selectors.proceedings.selector + ' ' + 
      selectors.proceedings.decisionDate,
   getValue: (elH) => elH.innerHTML,
   transformValue: toDateUTC18
  },

  {path: 'proceedings[].iJDecision',
   selector: selectors.proceedings.selector + ' ' + 
      selectors.proceedings.iJDecision,
   getValue: (elH) => elH.innerHTML
  },
  {path: 'proceedings[].hearingLocation.addr1',
   selector: selectors.proceedings.selector + ' ' + 
      selectors.proceedings.hearingLocationAddr1,
   getValue: (elH) => elH.innerHTML
  },
  {path: 'proceedings[].hearingLocation.cityStateZip',
   selector: selectors.proceedings.selector + ' ' + 
      selectors.proceedings.hearingLocationCityStateZip,
   getValue: (elH) => elH.innerHTML
  },

  /********* hearings ****************/
  {path: 'hearings[].type',
   selector: selectors.hearings.selector + ' ' +selectors.hearings.type,
   getValue: (elH) => elH.innerHTML
  },
  {path: 'hearings[].date.origDate',
   selector: selectors.hearings.selector + ' ' +selectors.hearings.date,
   getValue: (elH) => elH.innerHTML.replace(new RegExp("\ <span.*$"), '')
  },
  {path: 'hearings[].date.date',
   selector: selectors.hearings.selector + ' ' +selectors.hearings.date,
   getValue: (elH) => elH.innerHTML.replace(new RegExp("\ <span.*$"), ''),
   transformValue: toDateUTC18
  },
  {path: 'hearings[].date.origTime',
   selector: selectors.hearings.selector + ' ' + selectors.hearings.time,
   getValue: (elH) => elH.innerHTML
  },
  {path: 'hearings[].date.timeFrom',
   selector: selectors.hearings.selector + ' ' + selectors.hearings.time,
   getValue: (elH) => elH.innerHTML.substr(1, 8)
  },
  {path: 'hearings[].date.timeTo',
   selector: selectors.hearings.selector + ' ' + selectors.hearings.time,
   getValue: (elH) => elH.innerHTML.substr(12, 8)
  },
  {path: 'hearings[].location.addr1',
   selector: selectors.hearings.selector + ' ' + 
      selectors.hearings.locationAddr1,
   getValue: (elH) => elH.innerHTML
  },
  {path: 'hearings[].location.cityStateZip',
   selector: selectors.hearings.selector + ' ' + 
      selectors.hearings.locationCityStateZip,
   getValue: (elH) => elH.innerHTML
  },
  {path: 'hearings[].iJAssigned',
   selector: selectors.hearings.selector + ' ' + selectors.hearings.iJAssigned,
   getValue: (elH) => elH.innerHTML
  },

];

module.exports = {
  selectors: selectors, 
  gotoCase: gotoCase,
  getCaseData: getCaseData,
};

/** eoir id - unique id used by eoir to reference a case
  * @typedef {Number} eoirId
**/ 

/** go to case page give eoir id; assumes logged in and disclaimer accepted
  * @param {Page} page
  * @param {eoirId} id
  * @returns {Promise<Response>} 
**/
function gotoCase(page, id) {

  return eoirShared.gotoSigPage(page, 'cases/' + id);

}

/** scrape the data from the case page
  * @param {Page} page
  * @param {String} id
  * @returns {Promise<CaseDetails>}
**/
function getCaseData(page, id) {
  let caseDetails = {}; 
  caseDetails.eoirId = id; 

  return gotoCase(page, id)
  .then(() => pfns.scrapeIt(page, caseDetailScrapes, caseDetails))
  .then(() => caseDetails);
}

/** return a Date object setting UTC Hours to 18
  * @param {String} ds The date in mm/dd/yyyy format
  * @returns {Date | null}
**/ 
function toDateUTC18(ds) {
  let d = new Date(ds).setUTCHours(18); 
  return d ? new Date(d) : null; 
}
