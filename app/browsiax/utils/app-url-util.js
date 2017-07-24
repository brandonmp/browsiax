/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const path = require('path');
const UrlUtil = require('./url-util');

/**
 * Returns the URL to the application's manifest
 */
module.exports.getManifestUrl = function() {
    return module.exports.getBraveExtUrl('manifest.webapp');
};

/**
 * Determines whether a string is a valid URL. Based on node-urlutil.js.
 * @param {string} input
 */
module.exports.isUrl = function(input) {
    return UrlUtil.isURL(input);
};

/**
 * Gets base url from an about: url or its target mapping.
 */
function getBaseUrl(input) {
    return typeof input === 'string' ? input.split(/#|\?/)[0] : '';
}
module.exports.getBaseUrl = getBaseUrl;

/**
 * Gets hash part of a url
 */
function getHash(input) {
    return typeof input === 'string' ? input.split('#')[1] : '';
}

module.exports.navigatableTypes = [
    'http:',
    'https:',
    'about:',
    'chrome:',
    'chrome-extension:',
    'chrome-devtools:',
    'file:',
    'view-source:',
    'ftp:',
    'magnet:'
];

/**
 * Determine the URL to use when creating a new tab
 */
