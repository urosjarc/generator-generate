.DEFAULT_GOAL := book

book: clean
	cp src build -r
	rm build/book -rf
	cp src/book/$(LANG) build/book -r

	cd build && pdflatex main.tex
	xdg-open build/main.pdf

#! Book languages
#! ==============

clean:
	rm build -rf