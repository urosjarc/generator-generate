'use strict';

var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

/**
 * Module for license handeling.
 * @module license
 * @protected
 */

/**
 * Get license file path or directory.
 *
 * @param name {String}
 * @private
 */
exports.private_licensesPath = function (name) {
	// Get licnse path
	return path.join(__dirname, 'licenses', name || '.');
};

/**
 * Get licenses names. (https://spdx.org/licenses/)
 *
 * @returns {Array<String>}
 */
exports.getNames = function () {
	// Get all licences names
	return fs.readdirSync(this.private_licensesPath());
};

/**
 * Get license file content.
 *
 * @param licenseName {String}
 * @param year {String}
 * @param author {String
 * @returns {String}
 */
exports.getContent = function (licenseName, author) {
	var licenseContent = fs.readFileSync(this.private_licensesPath(licenseName), 'utf-8');
	// Return rendered license content
	return ejs.render(
		licenseContent, {
			author: author
		}
	);
};
