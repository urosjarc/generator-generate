PACKAGE = src
VIRTUAL_ENV = venv

PWD = $(shell pwd)
NOW_DATE = $(shell date "+%Y-%m-%d %H:%M:%S")
PY = $(VIRTUAL_ENV)/bin/python3
PIP = $(VIRTUAL_ENV)/bin/pip3

export WORKON_HOME := $(PY)
export PATH := $(WORKON_HOME):$(VIRTUAL_ENV)/bin:$(PATH)

define PRINT_HELP_PYSCRIPT
import re, sys
for line in sys.stdin:
	match = re.match(r'^### (.*) #', line)
	if match:
		target = match.groups()[0]
		print("\n%s" % (target))
	match = re.match(r'^([a-zA-Z0-9_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("  %-15s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT

help:
	@echo System info:
	@echo   - DATE_NOW: $(NOW_DATE)
	@echo   - WORKON_HOME: $(WORKON_HOME)
	@echo   - PACKAGE: $(PACKAGE)
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

.DEFAULT_GOAL := help
