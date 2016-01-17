




all: test


test:
	@cd app && \
		node_modules/mocha/bin/mocha \
	

testd:
	@cd app && \
		node_modules/mocha/bin/mocha \
		--debug


run:
	@cd app && \
		CONFIG=dev-local node app.js | node_modules/bunyan/bin/bunyan

debug:
	@cd app && \
		CONFIG=dev-local node debug app.js | node_modules/bunyan/bin/bunyan

forever-dev:
	@cd app && \
		 CONFIG=dev node_modules/forever/bin/forever start app.js