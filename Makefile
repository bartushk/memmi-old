




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
		node app.js


debug:
	@cd app && \
		node debug app.js
		
