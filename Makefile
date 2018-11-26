.PHONY: build deploy

build:
	npm run build

deploy: build
	cp CNAME ./dist
	push-dir --dir=dist --branch=gh-pages --cleanup
