'use strict';

var subgenerator = require('../app/lib').subgenerator;
var generator = require('yeoman-generator');
var sh = require('shelljs');

module.exports = generator.Base.extend({
	_questions: function () {
		return {
			base: {
				book: []
			},
			module: {
				book_translation: [],
				book_language: [
					{
						type: 'input',
						name: 'lang',
						message: 'Language (short):'
					}
                ]
			}
		};
	},

	_base_book: function () {
	},

	_base_book_translation: function () {
	},

	_module_book_language: function () {
		sh.exec("make")
	}
}).extend(subgenerator);
