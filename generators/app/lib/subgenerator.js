'use strict';

var Helper = require('./helper');

/**
 * Generator methods.
 * All subgenerators will inherite its methods.
 * @module subgenerator
 */

/**
 * Initialize generator.
 * Setup helper and variables.
 */
exports.initializing = function () {
	// Init helper
	this.gen = new Helper(this);
	this._answeres = {};
};

/**
 * Ask user questions.
 * For module or base, depending on yo-rc.json file.
 */
exports.prompting = function () {
	var self = this;

	// Log action
	this.gen.logger.info('Run context:', 'PROMPTING');

	// Start post promp
	return this.gen.postPrompt(
		this._questions(),
		function (answeres) {
			self._answeres = answeres;
		});
};

/**
 * Save user answeres.
 * Save answeres to yo-rc.json file.
 */
exports.configuring = function () {
	// Log action
	this.gen.logger.info('Run context:', 'CONFIGURING');

	if (this.gen.isSubgeneratorInited()) {
		// If subgenerator is inited set module anseres to module property in yorc
		this.gen.setYoRc(this._answeres.module, 'module');
	} else {
		// Else set base answeres to base property in yorc
		this.gen.setYoRc(this._answeres.base, 'base');
	}
};

/**
 * Create file arhitecture.
 */
exports.writing = function () {
	var done = this.async();

	// Log action
	this.gen.logger.info('Run context:', 'WRITING');

	if (this.gen.isSubgeneratorInited()) {
		// if subgenerator is inited generate module
		this.gen.generateModule(this._answeres.module.name, done);
	} else {
		// if not generate base
		this.gen.generateBase(this._answeres.base.name, done);
	}
};

/**
 * Inject and call method.
 * Methods must be defined in subgenerator.
 */
exports.conflicts = function () {
	// Log action
	this.gen.logger.info('Run context:', 'CONFLICTS');

	// If subgenerator is inited
	if (this.gen.isSubgeneratorInited()) {
		// > Run line injector
		this.gen.runLineInjector(this._answeres.module.name);
	}
};

exports.install = function(){
	// Log action
	this.gen.logger.info('Run context:', 'INSTALL');

	var subGenType;
	var subGenMethod;

	// If subgenerator is inited
	if (this.gen.isSubgeneratorInited()) {
		subGenMethod = this._answeres.module.name;
		// > Call subgen. method with `_module_` prefix
		subGenType = '_module_';
	} else {
		// Else
		subGenMethod = this._answeres.base.name;
		// > Call subgen. method with `_base_` prefix
		subGenType = '_base_';
	}

	this.gen.callSubgeneratorMethod(subGenType + subGenMethod);
}
