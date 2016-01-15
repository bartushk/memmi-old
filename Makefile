




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
		MODE=prod node app.js | node_modules/bunyan/bin/bunyan


log:
	@cd app && \
		MODE=prod LOG_LEVEL=debug node app.js | node_modules/bunyan/bin/bunyan	

debug:
	@cd app && \
		LOG_LEVEL=debug node debug app.js | node_modules/bunyan/bin/bunyan

forever:
	@cd app && \
		PORT=80 node_modules/forever/bin/forever start app.js