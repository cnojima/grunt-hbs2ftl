# grunt-sephora-hbs2ftl

> Converts handlebarsJS templates and layouts to Freemarker templates

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-hbs2ftl --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-hbs2ftl');
```

## The "generate_layout" and "generate_templates" tasks

### Overview
In your project's Gruntfile, add a section named `generate_templates` and/or `generate_layout` to the data object passed into `grunt.initConfig()`.
For convenience, it's recommended to set input and output paths in the gruntfile execution scope.


```js
var viewsPath = __dirname + '/path/to/handlebars/templates',
  ftlPath = __dirname + '/path/to/ftls';
...
grunt.initConfig({
  generate_layout : {
    all_layouts : {
      files : [{
        expand : true,
        cwd : viewsPath + '/layouts/',
        src : [ '*.hbs' ],
        dest : ftlPath + '/layouts/', // path to ftl output folder relative to this Gruntfile.js
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
        dest : ftlPath + '/', // path to ftl output folder relative to this Gruntfile.js
        ext : '.ftl'
      }]
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 alpha with limited functionality released to the wild
0.1.1 cleanup for github and npm publishing
0.1.2 README.md updated, cruft pulled.
0.1.3 references to internal name refactored to grunt-hbs2ftl
0.1.6 handling handlebarsJS {{#with}} expression
0.1.14 handling of embedded {{#each}}'s as well as peer {{#each}}'s at all depths.