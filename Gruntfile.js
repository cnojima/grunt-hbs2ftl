/*
 * grunt-sephora-hbs2ftl
 * 
 *
 * Copyright (c) 2013 Chris Nojima
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
  viewsPath = __dirname + '/../../views';


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    generate_layout : {
      all_layouts : {
        files : [{
          expand : true,
          cwd : viewsPath + '/layouts/',
          src : [ '*.hbs' ],
          dest : 'tmp/layouts/', // path to ftl output folder relative to this Gruntfile.js
          ext : '.ftl'
        }]
      }
    },

    generate_templates : {
      all_hbs : {
        files : [{
          expand : true,
          cwd : viewsPath + '/',
          src : [ '**/*.hbs', '!**/layouts/*.hbs' ],
          dest : 'tmp/', // path to ftl output folder relative to this Gruntfile.js
          ext : '.ftl'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

    // Development WIP
    convert_hbsEachAll : {
      test_hbs : {
        files : [{
          expand : true,
          cwd : viewsPath + '/test',
          src : [ '**/*.hbs' ],
          dest : 'tmp/test/',
          ext : '.ftl'
        }]
      }
    },
    convert_hbsEach : {
      test_hbs : {
        files : [{
          expand : true,
          cwd : viewsPath + '/test',
          src : [ 'func_test_hbsEach.hbs' ],
          dest : 'tmp/test/',
          ext : '.ftl'
        }]
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('hbs2ftl', ['clean', 'generate_layout', 'generate_templates', 'nodeunit']);

  // By default, lint and run all tasks with tests.
  grunt.registerTask('default', ['jshint', 'hbs2ftl']);

  // just run tests
  grunt.registerTask('test', [ 'jshint', 'nodeunit' ]);

  // CN: dev tasks
  grunt.registerTask('hbseachall', ['convert_hbsEachAll']);
  grunt.registerTask('hbseach', ['convert_hbsEach']);
};
