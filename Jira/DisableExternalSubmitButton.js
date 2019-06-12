// ==UserScript==
// @name         Disable “External submit” button
// @namespace    https://github.com/rimi-itk/
// @version      0.1
// @description  Colorize My Work!
// @author       Mikkel Ricky
// @match        https://*.atlassian.net/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  const css = `
.sd-external-submit {
  visibility: hidden !important;
}
`

  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = css
  document.head.appendChild(style)
})()
