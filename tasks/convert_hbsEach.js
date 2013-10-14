'use strict';

var convert = require(__dirname + '/../modules/converter/converter.js');

module.exports = function(grunt) {
  grunt.registerMultiTask('convert_hbsEach', 'Converts handlebars {{#each}} expressions into Freemarker "<#list as this>" constructs', function() {
    console.log('@convert_hbsEach with ' + this.files.length + ' files');

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
      src = convert.hbsEach(src);

      grunt.file.write(f.dest, src, { encoding : 'utf8'});

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};