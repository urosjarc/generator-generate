'use strict';

var subgenerator = require('../app/subgenerator');
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
	_questions: function () {
		return {
			base: {
				base_sample: []
			},
			module: {
				module_sample: []
			}
		};
	},

	_base_base_sample: function () {
	},

	_module_module_sample: function () {
	}
}).extend(subgenerator);
