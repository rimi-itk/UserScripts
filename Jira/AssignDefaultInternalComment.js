// ==UserScript==
// @name         Default to "Internal comment" in assign dialog.
// @namespace    https://github.com/rimi-itk/
// @version      0.1
// @description
// @author       Mikkel Ricky
// @match        https://*.atlassian.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

	var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
				Array.prototype.slice.call(mutation.addedNodes).forEach(function (node) {
					if (Node.ELEMENT_NODE === node.nodeType && 'assign-issue' == node.getAttribute('id')) {
						jQuery(node.querySelector('.js-sd-internal-comment')).click()
					}
				})
            }
		}
    })

    observer.observe(document.documentElement, {
        childList: true,
		subtree: true
    })
}())
