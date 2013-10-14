//hbsEach
'use strict';

var grunt = require('grunt');

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

  layout_conversion : function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/test/func_test_hbsEach.ftl', { encoding : 'utf8'});
    var expected = grunt.file.read('test/expected/hbsEach.ftl', { encoding : 'utf8'});
    
    
    actual = actual.replace(/[\r\n]+/gim, '\n');
    expected = expected.replace(/[\r\n]+/gim, '\n');
    
    test.equal(actual, expected, 'HandlebarsJS {{#each}} should convert to Freemarker and contextualize all variables within its scope.');

    test.done();
  }

};
