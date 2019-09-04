#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from setuptools import setup

requirements = [
]

setup_requires = [
	'setuptools',
	'pip',
	'virtualenv'
]

tests_require = [
]

setup(
	name='src',
	install_requires=requirements,
	setup_requires=setup_requires,
	tests_require=tests_require,
	extras_require={
		'develop': tests_require + setup_requires
	}
)
