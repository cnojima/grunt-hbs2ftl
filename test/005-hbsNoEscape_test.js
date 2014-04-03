//hbsEach
'use strict';

var grunt = require('grunt'),
    globals = require('./../globals.js');

exports.test = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  hbsEach : function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/func_test_hbsNoEscape.ftl', { encoding : 'utf8'});
    var expected = grunt.file.read('test/expected/hbsNoEscape.ftl', { encoding : 'utf8'});
    
    actual = actual.replace(/[\r\n]+/gim, '\n');
    expected = expected.replace(/[\r\n]+/gim, '\n');
    
    //lets not compare the versionHeader since that could/should be dynamic (and wont match our static expectations)
    actual = actual.replace( globals.versionHeader, '' );
    
    test.equal(actual, expected, 'HandlebarsJS {{#each}} should convert to Freemarker and contextualize all variables within its scope.');

    test.done();
  }

};
