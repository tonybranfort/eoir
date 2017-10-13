## Modules

<dl>
<dt><a href="#module_case">case</a></dt>
<dd><p>module for eoir case</p>
</dd>
<dt><a href="#module_case-list">case-list</a></dt>
<dd><p>module for eoir case list pages</p>
</dd>
<dt><a href="#module_home">home</a></dt>
<dd><p>module for eoir home page</p>
</dd>
<dt><a href="#module_login">login</a></dt>
<dd><p>module for eoir login and basic navigation</p>
</dd>
<dt><a href="#module_pfns">pfns</a></dt>
<dd><p>module for puppeteer add-on functions for eoir</p>
</dd>
<dt><a href="#module_shared">shared</a></dt>
<dd><p>module for shared eoir functions</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getDiffs">getDiffs(lObj, rObj, path, options)</a> ⇒ <code><a href="#Diff">Array.&lt;Diff&gt;</a></code></dt>
<dd><p>return an array of paths from an object (<code>lObj</code>) that don&#39;t match another object (<code>rObj</code>)</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Diff">Diff</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#GetDiffsOptions">GetDiffsOptions</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_case"></a>

## case
module for eoir case


* [case](#module_case)
    * [~gotoCase(page, id)](#module_case..gotoCase) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [~getCaseData(page, id)](#module_case..getCaseData) ⇒ <code>Promise.&lt;CaseDetails&gt;</code>
    * [~toDateUTC18(ds)](#module_case..toDateUTC18) ⇒ <code>Date</code> \| <code>null</code>
    * [~CaseDetails](#module_case..CaseDetails) : <code>Object</code>
    * [~Hearing](#module_case..Hearing) : <code>Object</code>
    * [~Proceeding](#module_case..Proceeding) : <code>Object</code>
    * [~eoirId](#module_case..eoirId) : <code>Number</code>

<a name="module_case..gotoCase"></a>

### case~gotoCase(page, id) ⇒ <code>Promise.&lt;Response&gt;</code>
go to case page give eoir id; assumes logged in and disclaimer accepted

**Kind**: inner method of [<code>case</code>](#module_case)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 
| id | <code>eoirId</code> | 

<a name="module_case..getCaseData"></a>

### case~getCaseData(page, id) ⇒ <code>Promise.&lt;CaseDetails&gt;</code>
scrape the data from the case page

**Kind**: inner method of [<code>case</code>](#module_case)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 
| id | <code>String</code> | 

<a name="module_case..toDateUTC18"></a>

### case~toDateUTC18(ds) ⇒ <code>Date</code> \| <code>null</code>
return a Date object setting UTC Hours to 18

**Kind**: inner method of [<code>case</code>](#module_case)  

| Param | Type | Description |
| --- | --- | --- |
| ds | <code>String</code> | The date in mm/dd/yyyy format |

<a name="module_case..CaseDetails"></a>

### case~CaseDetails : <code>Object</code>
case data object

**Kind**: inner typedef of [<code>case</code>](#module_case)  

| Param | Type | Description |
| --- | --- | --- |
| eoirId | <code>String</code> |  |
| aNbr | <code>String</code> |  |
| aNbrStrip | <code>String</code> | The aNbr stripped of all chars except [0-9] |
| chargingDocDate | <code>Object</code> |  |
| chargingDocDate.orig | <code>String</code> | "mm/dd/yyyy" |
| chargingDocDate.date | <code>Date</code> | new Date(orig).setUTCHours(18) |
| alienName | <code>String</code> |  |
| hearingLocation | <code>String</code> |  |
| caseStatus | <code>String</code> |  |
| clock | <code>String</code> |  |
| hearings | <code>Array.&lt;Hearing&gt;</code> |  |
| proceeding | <code>Array.&lt;Proceeding&gt;</code> |  |

<a name="module_case..Hearing"></a>

### case~Hearing : <code>Object</code>
hearing data object

**Kind**: inner typedef of [<code>case</code>](#module_case)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> |  |
| date | <code>Object</code> |  |
| date.origDate | <code>String</code> |  |
| date.date | <code>Date</code> | new Date(orig).setUTCHours(18) |
| date.origTime | <code>String</code> |  |
| date.timeFrom | <code>String</code> |  |
| date.timeTo | <code>String</code> |  |
| location | <code>Object</code> |  |
| location.addr1 | <code>String</code> |  |
| location.cityStateZip | <code>String</code> |  |
| iJAssigned | <code>String</code> |  |

<a name="module_case..Proceeding"></a>

### case~Proceeding : <code>Object</code>
proceeding data object

**Kind**: inner typedef of [<code>case</code>](#module_case)  

| Param | Type | Description |
| --- | --- | --- |
| sortNbr | <code>String</code> |  |
| decisionDate | <code>Object</code> |  |
| decisionDate.orig | <code>String</code> |  |
| decisionDate.date | <code>Date</code> | new Date(orig).setUTCHours(18) |
| iJDecision | <code>String</code> |  |
| hearingLocation | <code>Object</code> |  |
| hearingLocation.addr1 | <code>String</code> |  |
| hearingLocation.cityStateZip | <code>String</code> |  |

<a name="module_case..eoirId"></a>

### case~eoirId : <code>Number</code>
eoir id - unique id used by eoir to reference a case

**Kind**: inner typedef of [<code>case</code>](#module_case)  
<a name="module_case-list"></a>

## case-list
module for eoir case list pages


* [case-list](#module_case-list)
    * [~gotoMyCases(page)](#module_case-list..gotoMyCases) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [~isOnMyCasesPage()](#module_case-list..isOnMyCasesPage)
    * [~getAllEoirIds(page)](#module_case-list..getAllEoirIds) ⇒ <code>Promise.&lt;(Array.&lt;eoirId&gt;\|Error)&gt;</code>
        * [~getIdsFromPage(page)](#module_case-list..getAllEoirIds..getIdsFromPage) ⇒ <code>Promise.&lt;Array.String&gt;</code>
        * [~getIdFromHref()](#module_case-list..getAllEoirIds..getIdFromHref)
    * [~getCaseListInfo(page)](#module_case-list..getCaseListInfo) ⇒ <code>CaseListInfo</code>
    * [~CaseListInfo](#module_case-list..CaseListInfo) : <code>Object</code>

<a name="module_case-list..gotoMyCases"></a>

### case-list~gotoMyCases(page) ⇒ <code>Promise.&lt;Response&gt;</code>
go to the My Cases page on the eoir site; assumes is logged in, returns Error if not. Will accept disclaimer if needed.

**Kind**: inner method of [<code>case-list</code>](#module_case-list)  

| Param | Type |
| --- | --- |
| page | <code>Page.&lt;(page\|Error)&gt;</code> | 

<a name="module_case-list..isOnMyCasesPage"></a>

### case-list~isOnMyCasesPage()
detrermine if page is my cases page

**Kind**: inner method of [<code>case-list</code>](#module_case-list)  
<a name="module_case-list..getAllEoirIds"></a>

### case-list~getAllEoirIds(page) ⇒ <code>Promise.&lt;(Array.&lt;eoirId&gt;\|Error)&gt;</code>
get all eoir ids by checking all cases on the eoir portal; assumes is logged in

**Kind**: inner method of [<code>case-list</code>](#module_case-list)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 


* [~getAllEoirIds(page)](#module_case-list..getAllEoirIds) ⇒ <code>Promise.&lt;(Array.&lt;eoirId&gt;\|Error)&gt;</code>
    * [~getIdsFromPage(page)](#module_case-list..getAllEoirIds..getIdsFromPage) ⇒ <code>Promise.&lt;Array.String&gt;</code>
    * [~getIdFromHref()](#module_case-list..getAllEoirIds..getIdFromHref)

<a name="module_case-list..getAllEoirIds..getIdsFromPage"></a>

#### getAllEoirIds~getIdsFromPage(page) ⇒ <code>Promise.&lt;Array.String&gt;</code>
get all eoir ids from class list page

**Kind**: inner method of [<code>getAllEoirIds</code>](#module_case-list..getAllEoirIds)  
**Returns**: <code>Promise.&lt;Array.String&gt;</code> - array of ids  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 

<a name="module_case-list..getAllEoirIds..getIdFromHref"></a>

#### getAllEoirIds~getIdFromHref()
return eoir id from an href of form 'https://portale.eoir.justice.gov/.../uniquesig0/cases/8013836'

**Kind**: inner method of [<code>getAllEoirIds</code>](#module_case-list..getAllEoirIds)  
**Pararm**: <code>String</code> href  
<a name="module_case-list..getCaseListInfo"></a>

### case-list~getCaseListInfo(page) ⇒ <code>CaseListInfo</code>
returns number of cases as indicated on case list page

**Kind**: inner method of [<code>case-list</code>](#module_case-list)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 

<a name="module_case-list..CaseListInfo"></a>

### case-list~CaseListInfo : <code>Object</code>
**Kind**: inner typedef of [<code>case-list</code>](#module_case-list)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| from | <code>Number</code> | The starting point of case list being viewed |
| to | <code>Number</code> | The ending point of case list being viewed |
| total | <code>Number</code> | The total number of cases in case list being viewed |

<a name="module_home"></a>

## home
module for eoir home page

<a name="module_home..gotoHome"></a>

### home~gotoHome(page) ⇒ <code>Promise.&lt;(Page\|Error.&lt;Response&gt;)&gt;</code>
go to portal home page https://portale.eoir.justice.gov; wb login page if user is not logged in

**Kind**: inner method of [<code>home</code>](#module_home)  
**Returns**: <code>Promise.&lt;(Page\|Error.&lt;Response&gt;)&gt;</code> - returns Response if status !== 200  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 

<a name="module_login"></a>

## login
module for eoir login and basic navigation


* [login](#module_login)
    * [~login(page, loginCreds)](#module_login..login) ⇒ <code>Promise.&lt;(Page\|Error)&gt;</code>
    * [~isLoggedIn(page)](#module_login..isLoggedIn) ⇒ <code>Promise.&lt;(Boolean\|Error)&gt;</code>
    * [~logoff()](#module_login..logoff)
    * [~LoginCreds](#module_login..LoginCreds) : <code>Object</code>

<a name="module_login..login"></a>

### login~login(page, loginCreds) ⇒ <code>Promise.&lt;(Page\|Error)&gt;</code>
log into eoir site; assumes user is logged off

**Kind**: inner method of [<code>login</code>](#module_login)  
**Returns**: <code>Promise.&lt;(Page\|Error)&gt;</code> - Throws error if login not successful  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 
| loginCreds | <code>LoginCreds</code> | 

<a name="module_login..isLoggedIn"></a>

### login~isLoggedIn(page) ⇒ <code>Promise.&lt;(Boolean\|Error)&gt;</code>
returns true (Promise) if there is a user logged in (no check on which user)

**Kind**: inner method of [<code>login</code>](#module_login)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 

<a name="module_login..logoff"></a>

### login~logoff()
log user off eoir portal

**Kind**: inner method of [<code>login</code>](#module_login)  
<a name="module_login..LoginCreds"></a>

### login~LoginCreds : <code>Object</code>
eoir login credentials (id, pw) object

**Kind**: inner typedef of [<code>login</code>](#module_login)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 
| pw | <code>String</code> | 

<a name="module_pfns"></a>

## pfns
module for puppeteer add-on functions for eoir


* [pfns](#module_pfns)
    * [~getNewBrowser()](#module_pfns..getNewBrowser)
    * [~getNewBrowserPage(options)](#module_pfns..getNewBrowserPage) ⇒ <code>Promise.&lt;Page&gt;</code>
    * [~checkValidResponse(response)](#module_pfns..checkValidResponse) ⇒ <code>Response</code> \| <code>Error.&lt;response&gt;</code>
    * [~enterValue(page, elP, value)](#module_pfns..enterValue) ⇒ <code>Promise.&lt;(Page\|Error.&lt;Response&gt;)&gt;</code>
    * [~getFrame(page, frameName)](#module_pfns..getFrame) ⇒ <code>Frame</code> \| <code>foundFrame</code>
    * [~gotoFrame(page, frames;, p)](#module_pfns..gotoFrame) ⇒
    * [~getEl(page, selectors)](#module_pfns..getEl) ⇒ <code>Promise.&lt;ElementHandler&gt;</code>
    * [~clickAndWait(page, selector)](#module_pfns..clickAndWait) ⇒ <code>Promise</code>
    * [~waitForIdle(page)](#module_pfns..waitForIdle) ⇒ <code>Promise</code>
    * [~select(page, selector, ...values)](#module_pfns..select) ⇒ <code>Promise</code>
    * [~isChecked()](#module_pfns..isChecked)
    * [~scrapeIt(page, scrapes, ro)](#module_pfns..scrapeIt) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~scrapeIt$(page, scrape, ro)](#module_pfns..scrapeIt$) ⇒ <code>Promise.&lt;(Object\|Error)&gt;</code>
    * [~scrapeIt$$(page, scrape, ro)](#module_pfns..scrapeIt$$) ⇒ <code>Promise.&lt;(Object\|Error)&gt;</code>
    * [~Page](#module_pfns..Page) : <code>Class</code>
    * [~Scrapes](#module_pfns..Scrapes) : <code>Array.&lt;Scrape&gt;</code>
    * [~Scrape](#module_pfns..Scrape) : <code>Object</code>

<a name="module_pfns..getNewBrowser"></a>

### pfns~getNewBrowser()
= puppeteer.launch; returns browser instance

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  
**See**: [https://github.com/GoogleChrome/puppeteer/blob/v0.11.0/docs/api.md#puppeteerlaunchoptions](https://github.com/GoogleChrome/puppeteer/blob/v0.11.0/docs/api.md#puppeteerlaunchoptions)  
<a name="module_pfns..getNewBrowserPage"></a>

### pfns~getNewBrowserPage(options) ⇒ <code>Promise.&lt;Page&gt;</code>
return a new browser page

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options object as defined by https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions |

<a name="module_pfns..checkValidResponse"></a>

### pfns~checkValidResponse(response) ⇒ <code>Response</code> \| <code>Error.&lt;response&gt;</code>
check valid response; throw error with response if note

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type |
| --- | --- |
| response | <code>Response</code> | 

<a name="module_pfns..enterValue"></a>

### pfns~enterValue(page, elP, value) ⇒ <code>Promise.&lt;(Page\|Error.&lt;Response&gt;)&gt;</code>
enter a value in an input element

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Page</code> |  |
| elP | <code>Promise</code> | Promise that resolves to an element handler |
| value | <code>String</code> \| <code>Number</code> | value to enter |

<a name="module_pfns..getFrame"></a>

### pfns~getFrame(page, frameName) ⇒ <code>Frame</code> \| <code>foundFrame</code>
goes through all frames in page and returns frame with name requested

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type |
| --- | --- |
| page | <code>page</code> | 
| frameName | <code>String</code> | 

<a name="module_pfns..gotoFrame"></a>

### pfns~gotoFrame(page, frames;, p) ⇒
get url of frame and goto that url

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  
**Returns**: <Promise>  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>page</code> |  |
| frames; | <code>String</code> \| <code>Array.&lt;String&gt;</code> | frame name or array of frame names |
| p | <code>Promise</code> \| <code>undefined</code> | a promise to wait for |

<a name="module_pfns..getEl"></a>

### pfns~getEl(page, selectors) ⇒ <code>Promise.&lt;ElementHandler&gt;</code>
retrieve an element handler given either a selector string or a selector obj

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Page</code> |  |
| selectors | <code>String</code> \| <code>Array.&lt;String&gt;</code> | if array, then in order of frame name with last being elementselector string |

**Example**  
```js
// returns Promise resolving to element #myelid in main_frame in main_iframe
 getEl(page, ['main_frame', 'main_iframe', '#myelid']) 
```
<a name="module_pfns..clickAndWait"></a>

### pfns~clickAndWait(page, selector) ⇒ <code>Promise</code>
runs puppeteer page.click and then waits for network idle

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 
| selector | <code>String</code> | 

<a name="module_pfns..waitForIdle"></a>

### pfns~waitForIdle(page) ⇒ <code>Promise</code>
wait for page to network idle

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 

<a name="module_pfns..select"></a>

### pfns~select(page, selector, ...values) ⇒ <code>Promise</code>
select an item in an html select dropdown

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  
**See**: [https://stackoverflow.com/questions/45864516/how-to-select-an-option-from-dropdown-select](https://stackoverflow.com/questions/45864516/how-to-select-an-option-from-dropdown-select)  
**Todo**

- [ ] Replace with page.select when Puppeteer v.12 is released


| Param | Type |
| --- | --- |
| page | <code>Page</code> | 
| selector | <code>String</code> | 
| ...values | <code>Array.&lt;string&gt;</code> | 

<a name="module_pfns..isChecked"></a>

### pfns~isChecked()
return if the input radio is selected

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  
**Param{page}**: page  
**Param{string}**: selector - input selector (without :checked)  
**Returns{promise&lt;boolean&gt;}**:   
<a name="module_pfns..scrapeIt"></a>

### pfns~scrapeIt(page, scrapes, ro) ⇒ <code>Promise.&lt;Object&gt;</code>
scrape data from page into object using Scrape

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - returns updated ro Object with props filled in with values  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Page</code> |  |
| scrapes | <code>Scrapes</code> |  |
| ro | <code>Object</code> \| <code>undefined</code> | The object to be updated and returned |

**Example**  
```js
Non array path
 // returns Promise resolving to {gottaName: "Johnny"}
 scrapeIt(page, [{selector: 'input#name', path:'date', getValue: (elH) => elH.value}])
```
**Example**  
```js
With transformValue
 // returns Promise resolving to {date: 1975-05-01T05:00:00.000Z}
 scrapeIt(page, [
  {selector: 'div#dateStr', 
    path:'dateOf', 
    getValue: (elH) => elH.value
    transformValue: (val) => new Date(val)}])
```
**Example**  
```js
Array path
 // returns Promise resolving to {names:[{gottaName: "Johnny"}, {gottaName: "Jarvia"}]}
 scrapeIt(page, [{selector: 'input#names tr td', path:'names[].gottaName', getValue: (elH) => elH.innerHTML}])
 
```
<a name="module_pfns..scrapeIt$"></a>

### pfns~scrapeIt$(page, scrape, ro) ⇒ <code>Promise.&lt;(Object\|Error)&gt;</code>
scrape one element and assign to object following

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 
| scrape | <code>Scrape</code> | 
| ro | <code>Object</code> \| <code>undefined</code> | 

<a name="module_pfns..scrapeIt$$"></a>

### pfns~scrapeIt$$(page, scrape, ro) ⇒ <code>Promise.&lt;(Object\|Error)&gt;</code>
scrape multiple ($$) elements and assign to object in array

**Kind**: inner method of [<code>pfns</code>](#module_pfns)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 
| scrape | <code>Scrape</code> | 
| ro | <code>Object</code> \| <code>undefined</code> | 

<a name="module_pfns..Page"></a>

### pfns~Page : <code>Class</code>
Page class as defined by puppeteer 
https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page

**Kind**: inner typedef of [<code>pfns</code>](#module_pfns)  
<a name="module_pfns..Scrapes"></a>

### pfns~Scrapes : <code>Array.&lt;Scrape&gt;</code>
**Kind**: inner typedef of [<code>pfns</code>](#module_pfns)  
<a name="module_pfns..Scrape"></a>

### pfns~Scrape : <code>Object</code>
**Kind**: inner typedef of [<code>pfns</code>](#module_pfns)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Selector</code> |  |
| path | <code>String</code> | Path in dot notation. '[]' in path will be replaced with [idx] |
| getValue | <code>function</code> | Function that takes an ElementHandle found at selector and resolves to value to be assigned to path |
| transformValue | <code>function</code> \| <code>undefined</code> | Function to process result of getValue |

<a name="module_shared"></a>

## shared
module for shared eoir functions


* [shared](#module_shared)
    * [~getBaseHrefSig(href)](#module_shared..getBaseHrefSig) ⇒ <code>String</code>
    * [~getBaseSigUrl(page)](#module_shared..getBaseSigUrl) ⇒ <code>String</code>
    * [~gotoSigPage(page, href)](#module_shared..gotoSigPage) ⇒ <code>Promise</code>

<a name="module_shared..getBaseHrefSig"></a>

### shared~getBaseHrefSig(href) ⇒ <code>String</code>
returns eoir href through unique sig
https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c489ab4948/uniquesig0/

**Kind**: inner method of [<code>shared</code>](#module_shared)  

| Param | Type |
| --- | --- |
| href | <code>String</code> | 

<a name="module_shared..getBaseSigUrl"></a>

### shared~getBaseSigUrl(page) ⇒ <code>String</code>
returns eoir base url through unique sig using the current page url; s/b logged in and accepted disclaimer
https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c489ab4948/uniquesig0/

**Kind**: inner method of [<code>shared</code>](#module_shared)  

| Param | Type |
| --- | --- |
| page | <code>Page</code> | 

**Example**  
```js
// returns 'https://portale.eoir.justice.gov/uniquesig340d161e9d8c4d852c2fb0c489ab4948/uniquesig0'
  getBaseSigUrl(page);
```
<a name="module_shared..gotoSigPage"></a>

### shared~gotoSigPage(page, href) ⇒ <code>Promise</code>
page.goto(getBaseSigUrl + href)

**Kind**: inner method of [<code>shared</code>](#module_shared)  
**Returns**: <code>Promise</code> - resolves when networkidle  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Page</code> |  |
| href | <code>String</code> | Such as '/cases' or '/cases/7153245' |

<a name="getDiffs"></a>

## getDiffs(lObj, rObj, path, options) ⇒ [<code>Array.&lt;Diff&gt;</code>](#Diff)
return an array of paths from an object (`lObj`) that don't match another object (`rObj`)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| lObj | <code>Any</code> |  |
| rObj | <code>Any</code> |  |
| path | <code>String</code> \| <code>undefined</code> | Path to object attribute in dot notation |
| options | [<code>GetDiffsOptions</code>](#GetDiffsOptions) \| <code>undefined</code> |  |

**Example**  
```js
// returns [{path: 'a', lObj: 3, rObj: undefined}] getDiffs({a: 5}, {c: 22})
```
**Example**  
```js
// returns [{path: 'a.b', lObj: 3, rObj: 5}, ]  getDiffs({a: {b: 3}}, {a: {b: 5}})
```
**Example**  
```js
// returns [{path: 'a[0].b.c', lObj: 5, rObj: 7}, ]  getDiffs({a: [{b: {c: 5}}]}, {a: [{b: {c: 7}}]})
```
**Example**  
```js
// returns [{path: 'a.b', lObj: {c: 8}, rObj: {c: 7}}, ]  getDiffs({a: {b: {c: 8}}}, {a: {b: {c: 7}}}, undefined, {stopAt: {"a.b": true}})
```
<a name="Diff"></a>

## Diff : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The dot notation path to the property with diff |
| lObj | <code>Any</code> | The object or value of the left object compared |
| rObj | <code>Any</code> | The object or value of the right object compared |

<a name="GetDiffsOptions"></a>

## GetDiffsOptions : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| stopAt | <code>Object</code> \| <code>undefined</code> | Object with paths as keys where those paths will not be descened only to determine if there is a difference |

