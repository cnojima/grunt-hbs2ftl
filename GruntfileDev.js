/*jslint node: true */

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
          src : [ 'test/func_test_hbsEachDeep.hbs', /*'checkout/checkout.hbs',*/ '!**/layouts/*.hbs' ],
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
    convert_hbsEach : {
      test_hbs : {
        files : [{
          expand : true,
          cwd : viewsPath + '/test',
          src : [ '/func_test_hbsEachAll.hbs' ],
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

  // By default, lint and run all tasks with tests.
  grunt.registerTask('default', [ 'jshint', 'clean', 'generate_templates' ]);

  // just run tests
  grunt.registerTask('test', [ 'clean', 'jshint', 'nodeunit' ]);
};
