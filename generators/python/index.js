'use strict';

var subgenerator = require('../app/lib').subgenerator;
var generator = require('yeoman-generator');
var sh = require('shelljs');

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
		sh.echo("\n> make setup ...\n")
		sh.exec("make setup");

		sh.echo("\n> make run ...\n")
		sh.exec("make run");
	},

	_module_empty: function () {
		sh.echo("\n> make run ...\n")
		sh.exec("make run");
	}
}).extend(subgenerator);
