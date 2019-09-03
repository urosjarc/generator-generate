'use strict';

var generator = require('yeoman-generator');
var Helper = require('./lib').helper;

/**
 * App subgenerator methods.
 * Module hold all app subgenerator logic.
 * @module generator
 */

/**
 * Constructor. Setup options and arguments
 * for generator to use.
 */
exports.constructor = function () {
	// Setup arguments
	generator.Base.apply(this, arguments);
	// Setup options
	this.option('debug', {
		desc: 'Debug generator to ./generator.debug file',
		type: Boolean,
		default: false
	});
};

/**
 * Initialize properties.
 * Setup up helper and register helper process events.
 */
exports.initializing = function () {
	this.gen = new Helper(this);
	this.gen.registerProcessEvents();
	this._answeres = {};
};

/**
 * Prompting. Prompt user for basic app informations,
 * and print welcome message.
 */
exports.prompting = function () {
	var self = this;

	this.gen.logger.info('Run context:', 'PROMPTING');

	if (!this.gen.isGeneratorInited()) {
		this.gen.sayWelcome();

		return this.gen.initPrompt(
			this._questions(),
			function (answeres) {
				self._answeres = answeres;
			});
	} else {
		this.gen.sayWelcomeBack();
	}
};

/**
 * Configuring. Creates `.yo-rc.json` file with
 * prompting answeres.
 */
exports.configuring = function () {
	this.gen.logger.info('Run context:', 'CONFIGURING');

	if (!this.gen.isGeneratorInited()) {
		this.gen.createYoRc(this._answeres);
	}
};

/**
 * Compose with subgenerator. Call subgenerator
 * base on user answeres.
 */
exports.compose = function () {
	this.gen.logger.info('Run context:', 'COMPOSE');

	this.gen.callSubgenerator(
		this.gen.getYoRc('app.subgenerator')
	);
};

/**
 * End generator process. Say goodbye and execute
 * ending logic.
 */
exports.end = function () {
	this.gen.logger.info('Run context:', 'END');

	this.gen.setYoRc(true, 'inited');
	this.gen.sayGoodBye();
};
