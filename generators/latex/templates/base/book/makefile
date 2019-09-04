.DEFAULT_GOAL := book-all

book: clean
	cp src build -r
	rm build/book -rf
	cp src/book/$(LAN) build/book -r

	cd build && pdflatex main.tex
	xdg-open build/main.pdf

book-all: \
	book-<%-base.lang%>


#! Book languages
book-<%-base.lang%>:
	$(MAKE) book LAN=<%-base.lang%>
#! ==============

clean:
	rm build -rf