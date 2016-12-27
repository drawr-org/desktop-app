ELECTRON_PKGR=node_modules/.bin/electron-packager
CURL=curl

GLIDE=glide

DRAWR_GH=https://github.com/drawr-team

.PHONY: pull run package

all: pull run

run:
	npm start

package:
	npm run package

pull: git-clean library patch-lib server

library: clean
	mkdir -p dist/lib--git
	$(CURL) -L $(DRAWR_GH)/core-lib/archive/master.tar.gz | tar -C dist/lib--git -xzU --strip-components=1
	cd dist/lib--git && npm install && npm run-script export
	cp -r dist/lib--git/dist dist/lib
	cp -r dist/lib--git/examples/basic dist/

patch-lib:
	patch -R -i electron.patch dist/basic/index.html

# clean-library:
# 	rm -rf dist/lib*

server: clean
	mkdir -p dist/server--git
	$(CURL) -L $(DRAWR_GH)/core-server/archive/websocket.tar.gz | tar -C dist/server--git -xzU --strip-components=1
	cd dist/server--git && $(GLIDE) install && go build -o dist/drawr-server
	cp -r dist/server--git/dist dist/server

# clean-server:
# 	rm -rf dist/server*

clean:
	rm -rf dist/{server,lib,basic}

git-clean:
	rm -rf dist/*--git
