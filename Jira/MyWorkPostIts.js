// ==UserScript==
// @name         Jira post-its
// @namespace    https://github.com/rimi-itk/
// @version      0.1
// @description  Colorize My Work!
// @author       Mikkel Ricky
// @match        https://app.tempo.io/timesheets/jira/my-work/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const colors = [
        // Post-It colors
        'rgb(255, 153,  42, 0.5)',
        'rgb(255, 104, 185, 0.5)',
        'rgb( 51, 153, 245, 0.5)',
        'rgb(109, 218, 109, 0.5)',
        'rgb(255, 212,  45, 0.5)',

        // Web colors (https://en.wikipedia.org/wiki/Web_colors#HTML_color_names)
        'rgb(100%, 100%, 100%, 0.5)', // White
        'rgb( 75%,  75%,  75%, 0.5)', // Silver
        'rgb( 50%,  50%,  50%, 0.5)', // Gray
        'rgb(  0%,   0%,   0%, 0.5)', // Black
        'rgb(100%,   0%,   0%, 0.5)', // Red
        'rgb( 50%,   0%,   0%, 0.5)', // Maroon
        'rgb(100%, 100%,   0%, 0.5)', // Yellow
        'rgb( 50%,  50%,  50%, 0.5)', // Olive
        'rgb(  0%, 100%,   0%, 0.5)', // Lime
        'rgb(  0%,  50%,   0%, 0.5)', // Green
        'rgb(  0%, 100%, 100%, 0.5)', // Aqua
        'rgb(  0%,  50%,  50%, 0.5)', // Teal
        'rgb(  0%,   0%, 100%, 0.5)', // Blue
        'rgb(  0%,   0%,  50%, 0.5)', // Navy
        'rgb(100%,   0%, 100%, 0.5)', // Fuchsia
        'rgb( 50%,   0%,  50%, 0.5)', // Purple
    ]

    const BY_DURATION = 'BY_DURATION'
    const BY_ISSUE = 'BY_ISSUE'
    const BY_PROJECT = 'BY_PROJECT'
    const colorFunction = BY_PROJECT

    const colorize = function () {
        const issueColors = {}

        document.querySelectorAll('[name="tempoWorklogCard"]').forEach(function (el) {
            let duration = 0
            const durationEl = el.querySelector('[name="tempoCardDuration"]')
            if (null !== durationEl) {
                const match = /(?:([0-9]+)h)? *(?:([0-9]+)m)?/.exec(durationEl.innerText.trim())
                if (null !== match) {
                    duration = 60*parseInt(match[1] || 0) + parseInt(match[2] || 0)
                }
            }

            let color = null

            if (BY_DURATION === colorFunction) {
                let index = 0
                if (duration > 4 * 60) {
                    index = 4
                } else if (duration > 3 * 60 ) {
                    index = 3
                } else if (duration > 2 * 60) {
                    index = 2
                } else if (duration > 1 * 60) {
                    index = 1
                } else if (duration > 0 * 60) {
                    index = 0
                }
                color = colors[index]
            } else {
                // const issueKeyEl = el.querySelector('[name="tempoCardIssueKey"]')
                const issueKeyEl = el.querySelector('a[href]')
                if (null !== issueKeyEl) {
                    const match = /^([^-]+)-(.+)/.exec(issueKeyEl.innerText.trim())
                    if (null !== match) {
                        const issueKey = match[0]
                        const projectKey = match[1]
                        const colorKey = BY_PROJECT === colorFunction ? projectKey : issueKey
                        if (colorKey in issueColors) {
                            color = issueColors[colorKey]
                        } else {
                            let index = Object.keys(issueColors).length
                            if (index < colors.length) {
                                color = colors[index]
                                issueColors[colorKey] = color
                            }
                        }
                    }
                }
            }

            if (null !== color) {
                el.style.backgroundColor = color
            }
        })
    }

    colorize();
    setInterval(colorize, 3000)
})();
