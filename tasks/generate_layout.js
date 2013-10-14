/*
 * grunt-sephora-hbs2ftl
 * 
 *
 * Copyright (c) 2013 Chris Nojima
 * Licensed under the MIT license.
 */

'use strict';


var convert = require(__dirname + '/../modules/converter/converter.js');

module.exports = function(grunt) {
  grunt.registerMultiTask('generate_layout', 'Converts express-hbs layout meta-templates Freemarker "layouts"', function() {
    console.log('@generate_layout with ' + this.files.length + ' files');

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath, { encoding : 'utf8'});
      }).join('');



      // convert blocks
      src = convert.hbsBlocks(src);

      // convert special body block
      src = convert.hbsBody(src);

      // convert includes
      src = convert.hbsIncludes(src);

      // convert comments
      src = convert.hbsComments(src);

      // wrap with required macro tag
      src = convert.injectMacroHandle(src, 'default');

      // substitute tokens
      src = convert.hbsTokens(src);

      grunt.file.write(f.dest, src, { encoding : 'utf8'});

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};