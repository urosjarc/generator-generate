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
	// Setup CLI arguments
	generator.Base.apply(this, arguments);
	// Setup debug option
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
	// Initialize helper
	this.gen = new Helper(this);
	// Register process events
	this.gen.registerProcessEvents();
	this._answeres = {};
};

/**
 * Prompting. Prompt user for basic app informations,
 * and print welcome message.
 */
exports.prompting = function () {
	var self = this;

	// Log method info
	this.gen.logger.info('Run context:', 'PROMPTING');

	if (this.gen.isGeneratorInited()) {
		// If gen. inited say welcome back
		this.gen.sayWelcomeBack();
	} else {
		// If gen. not inited say welcome and start initial prompting
		this.gen.sayWelcome();

		return this.gen.initPrompt(
			this._questions(),
			function (answeres) {
				self._answeres = answeres;
			});
	}
};

/**
 * Configuring. Creates `.yo-rc.json` file with
 * prompting answeres.
 */
exports.configuring = function () {
	// Log method info
	this.gen.logger.info('Run context:', 'CONFIGURING');

	if (!this.gen.isGeneratorInited()) {
		// If gen inited create .yo-rc.json file.
		this.gen.createYoRc(this._answeres);
	}
};

/**
 * Compose with subgenerator. Call subgenerator
 * base on user answeres.
 */
exports.compose = function () {
	// Log method info
	this.gen.logger.info('Run context:', 'COMPOSE');

	// Call subgenerator "<.yo-rc.json>.app.subgenerator"
	this.gen.callSubgenerator(
		this.gen.getYoRc('app.subgenerator')
	);
};

/**
 * End generator process. Say goodbye and execute
 * ending logic.
 */
exports.end = function () {
	// Log method info
	this.gen.logger.info('Run context:', 'END');

	// Set yorc file to inited
	this.gen.setYoRc(true, 'inited');
	// Say good bye
	this.gen.sayGoodBye();
};
