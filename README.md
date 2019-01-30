# UserScripts

## Installation

### Google Chrome

Install
[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
and Allow access to file URLs (go to
[chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo](chrome://extensions/?id=dhdgffkkebhmkfjojejmpbldmpobfkfo)).

Create a new userscript and copy the `UserScript` header from a `js`
file. Insert a `@require` line to load the actual script from a local
file, e.g.

```js
// ==UserScript==
// @name         Jira post-its
// @namespace    https://github.com/rimi-itk/
// @version      0.1
// @description  Colorize My Work!
// @author       Mikkel Ricky
// @match        https://app.tempo.io/timesheets/jira/my-work/*
// @grant        none
// @require      file://«path to a clone of this repository»/Jira/MyWorkPostIts.js
// ==/UserScript==
```
