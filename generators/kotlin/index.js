'use strict';

var subgenerator = require('../app/subgenerator');
var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
	_questions: function () {
		return {
			base: {
				clean: [
					{
						type: 'input',
						name: 'gradle_version',
						message: 'Gradle version:',
						default: '5.6.2'
					}
				]
			},
			module: {
				module_sample: []
			}
		};
	},

	_base_clean: function () {
		sh.echo("\n> ./gradlew wrapper ...\n")
		sh.exec("./gradlew wrapper");

		sh.echo("\n> ./gradlew check ...\n")
		sh.exec("./gradlew check");
	},

	_module_module_sample: function () {
	}
}).extend(subgenerator);
