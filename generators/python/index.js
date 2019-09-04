'use strict';

var subgenerator = require('../app/subgenerator');
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
	_questions: function () {
		return {
			base: {
				empty: []
			},
			module: {
				empty: [
					{
						type: 'input',
						name: 'module',
						message: 'Module name:'
					}
                ]
			}
		};
	},

	_base_empty: function () {
		console.log("Executing base empty");
	},

	_module_empty: function () {
		console.log("Executing module empty");
	}
}).extend(subgenerator);
