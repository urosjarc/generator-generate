'use strict';

var Helper = require('./lib').helper;

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
	this.gen = new Helper(this);
	this._answeres = {};
};

/**
 * Ask user questions.
 * For module or base, depending on yo-rc.json file.
 */
exports.prompting = function () {
	var self = this;

	this.gen.logger.info('Run context:', 'PROMPTING');

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
	this.gen.logger.info('Run context:', 'CONFIGURING');

	if (this.gen.isSubgeneratorInited()) {
		this.gen.setYoRc(this._answeres.module, 'module');
	} else {
		this.gen.setYoRc(this._answeres.base, 'base');
	}
};

/**
 * Create file arhitecture.
 */
exports.writing = function () {
	var done = this.async();

	this.gen.logger.info('Run context:', 'WRITING');

	if (this.gen.isSubgeneratorInited()) {
		this.gen.generateModule(this._answeres.module.name, done);
	} else {
		this.gen.generateBase(this._answeres.base.name, done);
	}
};

/**
 * Inject and call method.
 * Methods must be defined in subgenerator.
 */
exports.conflicts = function () {
	var subGenMethod;

	this.gen.logger.info('Run context:', 'CONFLICTS');

	if (this.gen.isSubgeneratorInited()) {
		subGenMethod = this._answeres.module.name;
		this.gen.runLineInjector(subGenMethod);
		this.gen.callSubgeneratorMethod('_module_' + subGenMethod);
	} else {
		subGenMethod = this._answeres.base.name;
		this.gen.callSubgeneratorMethod('_base_' + subGenMethod);
	}
};
