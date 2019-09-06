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
				android: [
					{
						type: 'input',
						name: 'android_gradle_version',
						message: 'Android build Gradle version:',
						default: '3.4.0-rc03'
					}
				],
				desktop: [
					{
						type: 'input',
						name: 'fx_jvm_version',
						message: 'JavaFx JVM version:',
						default: '12'
					},
					{
						type: 'input',
						name: 'tornado_version',
						message: 'Tornado version:',
						default: '1.7.17'
					}
				],
				server: [
					{
						type: 'input',
						name: 'ktor_version',
						message: 'Ktor version:',
						default: '1.2.4'
					},
					{
						type: 'input',
						name: 'logback_version',
						message: 'Logback version:',
						default: '1.2.3'
					}
				]
			}
		};
	},

	_base_clean: function () {
		sh.echo("\n> ./gradlew wrapper ...\n")
		sh.exec("./gradlew wrapper");
	},

	_check: function(module){
		sh.echo("\n> ./gradlew check ...\n")
		sh.exec("./gradlew check");
	}

	_module_adapter: function () {
		this._check();
	}
	_module_android: function () {
		this._check();
	}
	_module_server: function () {
		this._check();
	}
	_module_desktop: function () {
		this._check();
	}

}).extend(subgenerator);
