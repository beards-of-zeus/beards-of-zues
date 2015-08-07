module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    webpack: {
      entry: './client/components/main.js',
      output: {
        filename: 'public/js/app.js'
      },
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel'
          }
        ]
      }
    },

    uglify: {
      client: {
        src: 'public/js/app.js',
        dest: 'public/dist/app.min.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      },
    },

    jshint: {
      files: [
        // Add filespec list here
        '**/**/*.js'
      ],
      options: {
        force: false,
        jshintrc: '.jshintrc',
        ignores: [
          'public/js/app.js',
          'node_modules/**/*.js'
        ]
      }
    },

    cssmin: {
      files: {
        src: 'public/css/app.css',
        dest: 'public/dist/app.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'client/components/main.js'
        ],
        tasks: [
          'jshint',
          'webpack'
        ]
      },
      css: {
        files: 'public/**/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: [
          'git add .',
          'git commit -m "Deployment"',
          'git push azure master'
        ].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('server-dev', function () {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });
  
  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'cssmin',
    'webpack',
    'uglify'
  ]);

  grunt.registerTask('upload', function () {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['shell']);
    } else {
      //grunt.task.run([ 'test' ]);
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'build',
    'upload'
  ]);


};
