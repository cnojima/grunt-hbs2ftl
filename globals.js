var grunt = require('grunt')
  , pkg = grunt.file.readJSON( __dirname + '/package.json');


module.exports = {
  
  versionHeader: "<#-- TEST grunt-hbs2ftl v." + pkg.version + " -->\n"

};