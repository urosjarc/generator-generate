'use strict';

var fs = require('fs');
var yosay = require('yosay');
var walk = require('walk');
var os = require('os');
var ejs = require('ejs');
var path = require('path');
var license = require('./license');
var winston = require('winston');
var utils = require('./utils');
var merge = require('merge');
var pac = require('../../../package.json');

/**
 * Helper module for generator and subgenerator.
 * Module that hold all hard logic.
 * @module helper
 */

/**
 * Constructor. Wraps generator instance generated with
 * `require('generator-generator').Base.extend({})`.
 *
 * @class Helper class which holds most hard logic,
 * so that generators/subgenerators methods can be
 * as clean as possible.
 *
 * @param generator {generator-generator.Base} Generator/subgenerator instance.
 *
 * @example
 * var test = 'hello world';
 *
 */
var Helper = function Helper(generator) {
	/**
	 * Holds generator instance.
	 * @member
	 */
	this.gen = generator;

	/**
	 * Holds class configuration.
	 * @member
	 */
	this.ENV = {};

	/**
	 * Main class logger.
	 * @member
	 */
	this.logger = {};

	// Init ENV
	this.private_initEnv();
	// Init logger
	this.private_initLogger();
	// Log starting info about the system
	this.private_initInfoLog();
};

/**
 * Setup ENV property.
 * @private
 */
Helper.prototype.private_initEnv = function () {
	var self = this;

	var genName = this.gen.rootGeneratorName();

	// Throw error if generator name is invalid
	if (!utils.testGeneratorName(genName)) {
		throw new utils.AppError(
			'generator name failed to validate!',
			'Issue: generator-NAME != ' + genName
		);
	}

	// Set ENV property
	this.ENV = {
		version: self.gen.rootGeneratorVersion(),
		name: {
			app: genName,
			generator: genName.split('-')[1]
		},
		path: {
			/**
			 * Get subgenerator path.
			 * @param name
			 */
			getSubgenerator: function (name) {
				return path.join(self.gen.templatePath('../..'), name || '.');
			},
			/**
			 * Get destination file path.
			 * @param file
			 * @returns {String}
			 */
			getDestination: function (file) {
				return self.gen.destinationPath(file || '.');
			},
			temp: {
				/**
				 * Get setup base dir.
				 * @returns {String}
				 */
				getSetupBase: function (name) {
					return path.join(self.gen.templatePath('setup/base'), name || '.');
				},
				/**
				 * Get setup ejs dir.
				 * @returns {String}
				 */
				getSetupEjs: function (name) {
					return path.join(self.gen.templatePath('setup/ejs'), name || '.');
				},
				/**
				 * Get base file path.
				 * @param name
				 * @returns {String}
				 */
				getBase: function (name) {
					return path.join(self.gen.templatePath('base'), name || '.');
				},
				/**
				 * Get module file path.
				 * @param name
				 * @returns {String}
				 */
				getModule: function (name) {
					return path.join(self.gen.templatePath('module'), name || '.');
				},
				/**
				 * Get setup injector path.
				 * @param name
				 * @returns {String}
				 */
				getSetupInjector: function (name) {
					var injector = name === undefined ? '.' : name + '.yml';
					return path.join(self.gen.templatePath('setup/injector'), injector);
				}
			}
		},
		logger: {
			file: {
				handleExceptions: true,
				humanReadableUnhandledException: true,
				level: 'silly',
				silent: !this.gen.options.debug,
				colorize: false,
				timestamp: false,
				filename: this.gen.destinationPath('generator.debug'),
				/**
				 * Format logger entry.
				 * @param options
				 * @returns {string}
				 */
				formatter: function (options) {
					var level = options.level.toUpperCase();
					var message = options.message ? options.message : '';
					var meta;

					if (Object.keys(options.meta).length !== 0) {
						meta = ': ' + JSON.stringify(options.meta, null, '\t');
					} else meta = '';

					return level + ' ' + message + meta;
				},
				json: false,
				eol: '\n',
				prettyPrint: true,
				showLevel: true,
				options: {flags: 'w'}
			},
			console: {
				handleExceptions: true,
				humanReadableUnhandledException: true,
				prettyPrint: true,
				silent: false,
				json: false,
				stringify: true,
				colorize: true,
				level: 'exception',
				showLevel: false,
				/**
				 * Format logger entry.
				 * @param options
				 * @returns {string}
				 */
				formatter: function (options) {
					return options.meta.stack.join('\n');
				}
			}
		}
	};
};

/**
 * Setup logger with winston logger instance.
 * @private
 */
Helper.prototype.private_initLogger = function () {
	// Set logger property
	this.logger = new winston.Logger({
		transports: [
			new (winston.transports.File)(this.ENV.logger.file),
			new (winston.transports.Console)(this.ENV.logger.console)
		],
		exitOnError: false
	});
};

/**
 * Setup logger with winston logger instance.
 * @private
 */
Helper.prototype.private_initInfoLog = function () {
	// Log system info
	this.logger.info('System info', {
		node: process.version,
		argv: process.argv,
		os: {
			patform: os.platform(),
			release: os.release(),
			type: os.type()
		}
	});
	// Log generator info
	this.logger.info('Generator info', {
		version: this.ENV.version,
		yoRc: this.getYoRc()
	});
};

/**
 * Structure ejs configuration
 * @param dir
 * @param config {{}} Config which will render files in 'dir'.
 * @returns {{}}
 */
Helper.prototype.private_ejsConfigFromDir = function (dir, config) {
	var ejsConfig = {};
	var ejsFilesPathsArr = utils.getAllFilesPaths(dir);

	// Loop for every file in dir
	ejsFilesPathsArr.forEach(function (ejsFilePath) {
		// Replace file path sybol `/` with `_` and add compiled string to returned object
		var ejsKey = ejsFilePath.replace(dir + '/', '').replace(/\//g, '_');
		// Render file content and add value to apropriet file value
		ejsConfig[ejsKey] = utils.ejsRender(ejsFilePath, config);
	});

	// Return object generated base on dir
	return ejsConfig;
};

/**
 * Register and catch process events.
 */
Helper.prototype.registerProcessEvents = function () {
	var self = this;

	// Register on exit process even
	process.on('exit', function (code) {
		// On exit log exit code
		self.logger.info('Process exit:', code);
	});
};

/**
 * Check if generator is inited in `yo-rc.json`.
 * @returns {boolean}
 */
Helper.prototype.isGeneratorInited = function () {
	return !!this.getYoRc('app');
};

/**
 * Check if subgenerator is inited in `yo-rc.json`.
 * @returns {boolean}
 */
Helper.prototype.isSubgeneratorInited = function () {
	return (
		this.isGeneratorInited() &&
		this.getYoRc('base') &&
		this.getYoRc('inited')
	);
};

/**
 * Run local subgenerator run context.
 * @param subgeneratorName {string} Subgenerator name.
 */
Helper.prototype.callSubgenerator = function (subgeneratorName) {
	// Log subgenerator call info
	this.logger.info('Call subgenerator', {
		name: this.ENV.name.generator + ':' + subgeneratorName,
		local: this.ENV.path.getSubgenerator(subgeneratorName)
	});

	// Compose generator with subgenerator
	this.gen.composeWith(
		this.ENV.name.generator + ':' + subgeneratorName, {}, {
			local: this.ENV.path.getSubgenerator(subgeneratorName)
		}
	);
};

/**
 * Generate license content base on `yo-rc.json` property `app.license'.
 * @returns {string} Generated license content.
 */
Helper.prototype.getLicense = function () {
	var licenseName = this.getYoRc('app.license');

	// Return license rendered content
	return license.getContent(
		licenseName,
		this.getYoRc('app.authorName')
	);
};

/**
 * Generate module structure base on subgenerator template.
 * @param moduleName {string} Module name.
 * @param done {function} Execute on done.
 */
Helper.prototype.generateModule = function (moduleName, done) {
	var destinationPath = this.ENV.path.getDestination();
	var basePath = this.ENV.path.temp.getModule(moduleName);

	// Log context
	this.logger.info('Generate module:', moduleName);

	// Generate module to destination
	this.generate(basePath, destinationPath, done);
};

/**
 * Generate base structure base on subgenerator template.
 * @param baseName {string} Base name.
 * @param done {function} Execute on done.
 */
Helper.prototype.generateBase = function (baseName, done) {
	var destinationPath = this.ENV.path.getDestination();
	var setupBasePath = this.ENV.path.temp.getSetupBase();
	var basePath = this.ENV.path.temp.getBase(baseName);
	var finish = {setup: false, base: false};

	// Log context
	this.logger.info('Generate base:', baseName);

	// Generate setup base to destination
	this.generate(setupBasePath, destinationPath, function () {
		if (finish.base === true) done();
		else finish.setup = true;
	});

	// Generate base to destination
	this.generate(basePath, destinationPath, function () {
		if (finish.setup === true) done();
		else finish.base = true;
	});
};

/**
 * Structure ejs config from .yo-rc.json, templates/ejs and app/template.ejs.
 * @returns {Object}
 */
Helper.prototype.getEjsAllConfig = function () {
	var yoRcConfig = this.getYoRc();

	// Merge `app/templates/ejs`, `template/setup/ejs`, `license`
	yoRcConfig.ejs = merge.recursive(
		this.private_ejsConfigFromDir(this.ENV.path.getSubgenerator('app/templates/ejs'), yoRcConfig),
		this.private_ejsConfigFromDir(this.ENV.path.temp.getSetupEjs(), yoRcConfig),
		{license: this.getLicense()}
	);

	// Return merged object
	return yoRcConfig;
};

/**
 * Main generate method which generate ejs configuration from
 * `yo-rc.json` file and subgenerator templates.
 * @param fromDir {string} Absolute path of source code.
 * @param toDir {string} Absolute path of destination.
 * @param done {function} Execute on done.
 */
Helper.prototype.generate = function (fromDir, toDir, done) {
	var self = this;

	var walker = walk.walk(fromDir);
	var yoRcConfig = this.getYoRc();
	var ejsTempConfig = this.getEjsAllConfig();

	// Walk on every file from dir
	walker.on('file', function (root, file, next) {
		var filePath = path.join(root, file.name);
		// On file render file path
		var renderedToPath = ejs.render(filePath.replace(fromDir, toDir), yoRcConfig);
		utils.isEditable(filePath, function (err, isEditable) {
			if (err) throw err;
			if (isEditable) {
				// If file is editable log action and write rendered context
				self.logger.debug('Write:', renderedToPath);
				self.gen.fs.write(renderedToPath, utils.ejsRender(filePath, ejsTempConfig));
			} else {
				// If file is not editable log action and copy file context to destination
				self.logger.debug('Copy:', renderedToPath);
				self.gen.fs.copy(filePath, renderedToPath);
			}
			next();
		});
	});

	walker.on('errors', function (root, statsArr) {
		// On walk error log informations
		throw new utils.AppError(
			'Walker error',
			'Root: ' + root,
			'Stats:\n - ' + statsArr.join('\n - ')
		);
	});

	// On end call done
	walker.on('end', done);
};

/**
 * It will inject lines in files base on template injector setup.
 * @param injectorName {string} Injector name.
 */
Helper.prototype.runLineInjector = function (injectorName) {
	var inject = utils.yamlToJson(
		this.ENV.path.temp.getSetupInjector(injectorName)
	);

	// Log action
	this.logger.info('Run line injector:', injectorName);

	// Loop for every file in injector
	for (var filePath in inject) { // eslint-disable-line
		// > Render injector text with ejs
		var destFilePath = ejs.render(
			this.ENV.path.getDestination(filePath),
			this.getYoRc()
		);

		// > If inject info is object than add support for multiple injections in one file!
		var injectInfos = inject[filePath];
		if(!Array.isArray(injectInfos))
			injectInfos = [injectInfos];

		// > Get file text
		var fileText = fs.readFileSync(filePath, 'utf8');

		for(var i in injectInfos) {
			var injectInfo = injectInfos[i];

			// > Check remove flag in injector
			var removeFlag = !!injectInfo.removeFlag;
			var lineFlag = injectInfo.flag;
			var injectArr = ejs.render(
				injectInfo.text,
				this.getEjsAllConfig()
			).split('\n');

			// > Debug injector action and info
			this.logger.debug('Inject', {
				filePath: destFilePath,
				lineFlag: lineFlag,
				injectArr: injectArr
			});

			// > Inject lines on line flag, optional do not remove flag
			fileText = utils.injectLines(fileText, lineFlag, injectArr, removeFlag);
		}

		// > Write final file text to destination
		this.gen.fs.write(destFilePath, fileText);
	}
};

/**
 * It will call subgenerator method with user specific code.
 * @param methodName {string} Subgenerator method name.
 */
Helper.prototype.callSubgeneratorMethod = function (methodName) {
	var error = true;

	// Check if method is in subgenerator and is function
	if (methodName in this.gen) {
		if (this.gen[methodName] instanceof Function) {
			// > Log action
			this.logger.info('Call subgenerator method:', methodName);
			// > Call method
			this.gen[methodName]();
			error = false;
		}
	}

	if (error) {
		// If method was not called throw error
		throw new utils.AppError(
			'subgenerator method not found!',
			'Method: ' + methodName
		);
	}
};

/**
 * Ask user questions base on provided questions array.
 * @param questions {array} Array of questions.
 * @param callback {function} Will execute when all the questions will be answered.
 * Callback will execute with answered object.
 */
Helper.prototype.initPrompt = function (questions, callback) {
	var self = this;

	var generatorQuestions = [
		{
			type: 'list',
			name: '_license',
			message: 'License:',
			choices: license.getNames()
		},
		{
			type: 'list',
			name: '_subgenerator',
			message: 'Select subgenerator:',
			choices: self.getSubgeneratorsNames()
		}
	];

	// Prompt initial questions
	return this.gen.prompt(questions).then(function (appAnswers) {
		// Prompt license and sugenerator questions
		return self.gen.prompt(generatorQuestions).then(function (generatorAnswers) {
			var answeres = {app: appAnswers};

			for (var i in generatorAnswers) { // eslint-disable-line
				answeres.app[i.slice(1)] = generatorAnswers[i];
			}

			// Log answeres
			self.logger.info('Init prompt answeres', answeres);
			// Call callback with answeres
			callback(answeres);
		});
	});
};

/**
 * Ask user questions specific to base or module.
 * @param questions {array} Array of questions.
 * @param callback {function} Execute with answered object.
 */
Helper.prototype.postPrompt = function (questions, callback) {
	var self = this;

	var template = this.isSubgeneratorInited() ? 'module' : 'base';

	var tmpNameQuestions = {
		base: [
			{
				type: 'list',
				name: '_name',
				message: 'Select project base:',
				choices: self.getBasesNames()
			}
		],
		module: [
			{
				type: 'list',
				name: '_name',
				message: 'Select project module:',
				choices: self.getModulesNames()
			}
		]
	}[template];

	// Prompt subgenerator project base and base module
	return this.gen.prompt(tmpNameQuestions).then(function (tmpNameAnsweres) {
		var tmpName = tmpNameAnsweres._name;

		// Prompt user defined questions for module
		return self.gen.prompt(questions[template][tmpName]).then(function (routeAnsweres) {
			var answeres = {};
			answeres[template] = routeAnsweres;
			answeres[template].name = tmpName;

			// Log prompt answeres
			self.logger.info('Post prompt answeres', answeres);
			// Exec callback with answeres
			callback(answeres);
		});
	});
};

/**
 * It will create `yo-rc.json` file to destination.
 * @param json {object} `yo-rc.json` content.
 */
Helper.prototype.createYoRc = function (json) {
	var yoRc = {};

	json.createdAt = utils.getNowDate();
	this.setYoRc(json);

	yoRc[this.ENV.name.app] = json;

	// Log yorc content
	this.logger.info('Create .yo-rc.json', yoRc);

	// Write yorc content to destination
	fs.writeFileSync(
		this.ENV.path.getDestination('.yo-rc.json'),
		JSON.stringify(yoRc, null, 4)
	);
};

/**
 * Get `yo-rc.json` content.
 * @param keys {string} If keys is `null` method will return
 * whole `yo-rc.json` content. If keys type will be string like `key.anotherKey`, it
 * will return key value or undefined.
 * @returns {object | string | undefined}
 */
Helper.prototype.getYoRc = function (keys) {
	// Split keys with `.` symbol
	var keysArr = keys ? keys.split('.') : [];

	// Get yorc value base on recurzive keys
	return utils.getJsonValue(
		keysArr,
		this.gen.config.getAll()
	);
};

/**
 * Set `yo-rc.json` content.
 * @param value {*} Value of key provided in parameters.
 * @param keys {string} Example `key.anotherKey`, it will create json if sub key
 * don't exist and set child key to value provided in parameters.
 */
Helper.prototype.setYoRc = function (value, keys) {
	// Log action
	this.logger.info('Set yoRc config', {
		value: value,
		keys: keys
	});

	// Set with recurzive algoritem yoRc
	if (keys) {
		this.gen.config.set(
			utils.setJsonValue(
				keys.split('.'),
				value,
				this.getYoRc()
			)
		);
	} else {
		this.gen.config.set(value);
	}

	// Log new yorc config
	this.logger.info('New yoRc config', this.getYoRc());
};

/**
 * Get template base names.
 * @returns {array<string>} Array of base names base on template folder.
 */
Helper.prototype.getBasesNames = function () {
	// Read bases dir and return names
	return fs.readdirSync(
		this.ENV.path.temp.getBase()
	);
};

/**
 * Get template module names.
 * @returns {array<string>} Array of module names base on template folder.
 */
Helper.prototype.getModulesNames = function () {
	// Read module dir and return names
	return fs.readdirSync(
		this.ENV.path.temp.getModule()
	);
};

/**
 * Get subgenerator names.
 * @returns {Array.<string>} Array of subgenerator names.
 */
Helper.prototype.getSubgeneratorsNames = function () {
	// Get generator dir and return filtered subgenerator names
	return fs.readdirSync(
		this.ENV.path.getSubgenerator()
	).filter(function (name) {
		return !/app/.test(name);
	});
};

/**
 * Print welcome message.
 */
Helper.prototype.sayWelcome = function () {
	// Yeoman guy will say welcome to termainal
	this.gen.log(yosay([
		pac.name,
		'v' + pac.version
	].join('\n')));
};

/**
 * Print welcome back message.
 */
Helper.prototype.sayWelcomeBack = function () {
	// Yeoman  guy will say welcome back to terminal
	this.gen.log(yosay([
		this.getYoRc('app.name'),
		'Created ' + this.getYoRc('createdAt') + ' by ' + this.getYoRc('app.authorName')
	].join(' ')));
};

/**
 * Print good bye message.
 */
Helper.prototype.sayGoodBye = function () {
	// GG2 will say good bye message to terminal
	this.gen.log([
		'',
		'▶ Process finished.',
		'▶ Good bye ♥'
	].join('\n'));
};

module.exports = Helper;
