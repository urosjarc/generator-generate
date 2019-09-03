'use strict';

var path = require('path');
var yoTest = require('yeoman-test');
var yoAssert = require('yeoman-assert');
var fs = require('fs');
var shell = require('shelljs');
var utils = require('./utils');
var assert = require('assert');

/**
 * Tester module
 * @module tester
 */

/**
 * Tester class
 * @param generatorsAppPath
 * @param subgenerator
 * @param baseName
 * @constructor
 */
function Tester(generatorsAppPath, subgenerator, baseName) {
	this._generatorsAppPath = generatorsAppPath;
	this.subgenerator = subgenerator;
	this.baseName = baseName;

	this._testedFiles = [];
}

/**
 * Static method.
 * @param command
 * @param done
 */
Tester.assertCommand = function (command, done) {
	// Assert shell command
	shell.exec(command, {silent: true}, function (code) {
		if (code === 0) {
			// > call done if exit code was 0
			done();
		} else {
			// > call done with error else
			done(new Error('Command (' + command + ') finish with ' + code + ' exit status.'));
		}
	});
};

/**
 * Assert command.
 * @param command
 * @param done
 */
Tester.prototype.assertCommand = Tester.assertCommand;

/**
 * runGenerator
 * @param prompt
 * @returns {*}
 */
Tester.prototype.runGenerator = function (prompt) {
	this._prompt = prompt;
	this._prompt._subgenerator = this.subgenerator;

	this._config = {
		app: this._prompt,
		base: {
			name: this.baseName
		},
		inited: undefined
	};

	this._prompt._name = this.baseName;

	// Start standard yeoman tester with tester setup informations
	return yoTest
		.run(this.getPath())
		.inDir(this.getTestDir())
		.withPrompts(this.getPrompt())
		.toPromise();
};

/**
 * assertContent
 * @param filePath
 * @param testArr
 * @param done
 */
Tester.prototype.assertContent = function (filePath, testArr, done) {
	// Get file content
	var content = fs.readFileSync(path.join(this.getTestDir(), filePath), 'utf8');

	// Loop every test array
	testArr.forEach(function (test) {
		if (test instanceof RegExp) {
			// > On regex test with regex
			if (!test.test(content)) {
				return done(new utils.AppError(
					'regex "' + test + '" failed!',
					'File: ' + filePath
				));
			}
		} else if (content.indexOf(test) === -1) {
			// > On string test with indexOf method
			return done(new utils.AppError(
				'text "' + test + '" is missing!',
				'File: ' + filePath
			));
		}
	});

	return done();
};

/**
 * Assert files and save it.
 * @param filePaths
 */
Tester.prototype.assertFiles = function (filePaths) {
	var self = this;

	// Loop every file path
	filePaths.forEach(function (filePath) {
		// > Test if file was called with assert files in tests
		if (self._testedFiles.indexOf(filePath) === -1) {
			self._testedFiles.push(filePath);
		}
	});

	// Test if all files in files paths exist
	yoAssert.file(filePaths);
};

/**
 * Assert test directory
 */
Tester.prototype.assertTestDir = function () {
	var self = this;
	var buildFiles = utils.getAllFilesPaths(this.getTestDir());
	buildFiles.forEach(function (file, i, array) {
		array[i] = file.replace(self.getTestDir() + '/', '');
	});
	// Test if builded files are the same as list of tested files
	assert.deepEqual(
		buildFiles.sort(),
		this.getTestedFiles().sort()
	);
};

/**
 * runSubgenerator
 * @param moduleName
 * @param prompt
 * @returns {*}
 */
Tester.prototype.runSubgenerator = function (moduleName, prompt) {
	prompt._name = moduleName;

	// Run standard yeoman tests suite base on tester informations
	return yoTest
		.run(this.getPath())
		.cd(this.getTestDir())
		.withLocalConfig(this.getConfig(true))
		.withPrompts(prompt)
		.toPromise();
};

/**
 * Get tested files.
 * @returns {Array}
 */
Tester.prototype.getTestedFiles = function () {
	// Return tested files with tester
	return this._testedFiles;
};

/**
 * getConfig
 * @param isInited
 * @returns {{app: *, base: {name: *}, inited: undefined}|*}
 */
Tester.prototype.getConfig = function (isInited) {
	var config = this._config;

	config.inited = isInited;

	// Return mocked `yo-rc.json`
	return config;
};

/**
 * getPath
 * @returns {*}
 */
Tester.prototype.getPath = function () {
	// Get generator app path
	return path.join(this._generatorsAppPath);
};

/**
 * describe test
 * @returns {string}
 */
Tester.prototype.describe = function (what) {
	var describe = what == null ? '' : what + ' ';

	// Return description for tester
	return (describe || '') + this.subgenerator + ' ' + this.baseName + ':';
};

/**
 * getTestDir
 * @returns {*}
 */
Tester.prototype.getTestDir = function () {
	// Return testing subgenerator dir
	return path.join(this._generatorsAppPath, '../../build/generators', this.subgenerator, this.baseName);
};

/**
 * getPrompt
 * @returns {*}
 */
Tester.prototype.getPrompt = function () {
	// Get prompt answeres
	return this._prompt;
};

/**
 * module.export
 * @type {Tester}
 */
module.exports = Tester;
