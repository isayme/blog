.PHONY: build deploy

build:
	npm run build

deploy: build
	push-dir --dir=dist --branch=gh-pages --cleanup
