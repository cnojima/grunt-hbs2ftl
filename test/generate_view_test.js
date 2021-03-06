 'use strict';

var grunt = require('grunt') ,
    globals = require('./../globals.js');


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.generate_layout = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

/*  view_template_conversion : function(test) {
    test.expect(1);
    var converted = grunt.file.read('tmp/index.ftl');
    var expected = grunt.file.read('test/expected/index.ftl');
    
    converted = converted.replace(/[\r\n]+/gim, '\n');
    converted = converted.trim();
    expected = expected.replace(/[\r\n]+/gim, '\n');
    expected = expected.trim();
    
    test.equal(converted, expected, 'home page conversion');

    test.done();
  },
*/
  checkout_conversion : function(test) {
    var converted = grunt.file.read('tmp/index.ftl');
    var expected = grunt.file.read('test/expected/index.ftl');

    converted = converted.replace(/[\r\n]+/gim, '\n');
    converted = converted.trim();
    
    //lets not compare the versionHeader since that could/should be dynamic (and wont match our static expectations)
    converted = converted.replace( globals.versionHeader, '' );

    expected = expected.replace(/[\r\n]+/gim, '\n');
    expected = expected.trim();

    test.expect(1);
    test.equal(converted, expected, 'checkout page conversion');
    test.done();

  }

};
