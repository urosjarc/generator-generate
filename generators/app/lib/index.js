'use strict';

var generator = require('./generator');
var subgenerator = require('./subgenerator');
var helper = require('./helper');
var utils = require('./utils');
var tester = require('./tester');

/**
 * Package main entry point which exports all public modules.
 * @module index
 *
 * @author Uroš Jarc
 * @copyright Uroš Jarc 2016
 * @license MIT
 *
 * @example
 * var generator2 = require('generator-generator2');
 */

module.exports = {

	/**
	 * {@link module:generator}
	 * @inner
	 */
	generator: generator,

	/**
	 * {@link module:helper}
	 * @inner
	 */
	helper: helper,

	/**
	 * {@link module:subgenerator}
	 * @inner
	 */
	subgenerator: subgenerator,

	/**
	 * {@link module:utils}
	 * @inner
	 */
	utils: utils,

	/**
	 * {@link module:tester}
	 * @inner
	 */
	tester: tester

};
