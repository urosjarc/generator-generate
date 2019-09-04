'use strict';

var subgenerator = require('../app/lib').subgenerator;
var generator = require('yeoman-generator');
var sh = require('shelljs');

module.exports = generator.Base.extend({
	_questions: function () {
		return {
			base: {
				book: [
					{
						type: 'input',
						name: 'lang',
						message: 'Language (short):',
						default: 'slo'
					}
				]
			},
			module: {
				book_translation: [],
				book_language: [
					{
						type: 'input',
						name: 'lang',
						message: 'Language (short):',
						default: 'eng'
					}
                ]
			}
		};
	},

	_base_book: function () {
		this._module_book_language();
	},

	_module_book_translation: function () {
	},

	_module_book_language: function () {
		sh.echo("\n> make ...\n");
		sh.exec("make");
	}
}).extend(subgenerator);
