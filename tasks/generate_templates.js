/*jslint node: true */
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

  var pkg = grunt.file.readJSON( __dirname + '/../package.json');

  grunt.registerMultiTask('generate_templates', 'Converts handlebarsJS templates into Freemarker templates', function() {
    console.log('@generate_templates with ' + this.files.length + ' files');

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
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
        console.log('generating [ ' + filepath + ' ]'); 
        return grunt.file.read(filepath, { encoding : 'utf8'});
      }).join('');

      src = convert.hbsStripHTMLComments(src);

      // console.log('--------- hbsArrayNotation');
      src = convert.hbsArrayNotation(src);

      // convert .length to [namespace]_index
      src = convert.hbsSize(src);

      // convert contentFor
      src = convert.hbsContentFor(src);

      // convert blocks
      src = convert.hbsBlocks(src);

      // convert each to list - high in order execution as it changes variable context internally
      src = convert.hbsWith(src);
      src = convert.hbsEach(src);

      // convert special body block
      src = convert.hbsBody(src);

      // convert includes
      src = convert.hbsIncludes(src);

      // convert explicitly set layouts
      src = convert.hbsExplicitLayout(src);

      // convert comments
      src = convert.hbsComments(src);

      // convert if/else
      src = convert.hbsIf(src);

      // convert eq to if clause
      src = convert.hbsEq(src);

      // convert unless to !if
      src = convert.hbsUnless(src);

      // convert default into string interpolator
      src = convert.hbsDefault(src);

      // handle html literals - also in hbstokens for namespacing
      src = convert.hbsNoEscape(src); 

      // handle {{#join }}
      src = convert.hbsJoin(src);

      // convert handlebars helpers in user-directives
// console.log('--------- hbsHelpers');
      src = convert.hbsHelpers(src); // must be run AFTER convert.hbsBlocks()

      // lastly, convert standard hbs tokens into ftl-versions
// console.log('--------- hbsTokens');
      src = convert.hbsTokens(src);

      src = convert.ftlTrim(src);

      src = src.trim();

      // add version tag
      src = '<#-- grunt-hbs2ftl v.' + pkg.version + ' -->\n' + src;

      // compress
      src = '<#ftl strip_whitespace=true strip_text=true><#compress>' + src + '</#compress>';

      grunt.file.write(f.dest, src, { encoding : 'utf8'});

      // Print a success message.
      // grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};