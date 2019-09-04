'use strict';

var path = require('path');
var generator2 = require('./lib').generator;
var utils = require('./lib').utils;
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({

	/**
	 * Generators questions.
	 * @returns {*[]}
	 * @private
	 */
	_questions: function () {
		var self = this;

		var gitName = self.user.git.name();
		var gitEmail = self.user.git.email();
		var appName = path.basename(this.destinationRoot());

		return [
			{
				type: 'input',
				name: 'name',
				message: 'Application name:',
				default: appName
			}
		];
	}
}).extend(generator2);
