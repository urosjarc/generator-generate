include config/Makefile

#============================
### DEVELOPING ########
#============================

setup: clean install ## clean, install, run

install: install-libs install-venv install-dep ## install all

install-libs: ## install external libraries
	@echo "Here installing..."

install-venv: clean-venv ## install virtualenv
	python3.6 -m venv $(VIRTUAL_ENV)

install-dep: clean-py ## install dependencies
	$(PIP) install --no-cache-dir -e .
	$(PIP) install --no-cache-dir -e ".[develop]"

#============================
### RUNNING #################
#============================

run: ## run src package
	$(PY) ./src

#============================
### CLEANING ################
#============================

clean: clean-venv clean-py ## clean all

clean-venv: clean-py ## clean virtualenv
	rm -fr $(VIRTUAL_ENV)

clean-py: clean-build clean-pyc ## clean python artifacts

clean-build: ## remove build artifacts
	rm -fr build
	rm -fr dist
	rm -fr .eggs/
	find . -name '*.egg-info' -exec rm -fr {} +
	find . -name '*.egg' -exec rm -f {} +
	find . -name '*.tar.gz' -exec rm -f {} +

clean-pyc: ## remove Python file artifacts
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	find . -name '__pycache__' -exec rm -fr {} +
