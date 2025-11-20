# Makefile - workspace: run npm scripts easily

.PHONY: all install build dev clean

all: build

install:
<TAB>npm ci

build:
<TAB>npm run build

dev:
<TAB>npm run dev

clean:
<TAB>rm -rf node_modules dist build
