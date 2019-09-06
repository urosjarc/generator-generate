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

		var appName = path.basename(this.destinationRoot());
		var gitName = self.user.git.name();
		var gitEmail = self.user.git.email();

		return [
			{
				type: 'input',
				name: 'name',
				message: 'Application name:',
				default: appName
			},
			{
				type: 'input',
				name: 'version',
				message: 'Application version:',
				default: '0.0.1'
			},
			{
				type: 'input',
				name: 'authorName',
				message: 'Author fullname:',
				default: gitName
			},
			{
				type: 'input',
				name: 'authorEmail',
				message: 'Author email:',
				default: gitEmail
			},
		];
	}
}).extend(generator2);
