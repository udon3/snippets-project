module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          config: 'config.rb'
        },
      }
    },
    scsslint: {
      files: ['src/assets/scss/**/*.scss', '!src/assets/scss/lib/**/*.scss'],
      options: {
        //bundleExec: true,
        config: '.scss-lint.yml',
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
       }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        browser: true,
        globals: {
          jQuery: true
        },
      },
      files: ['Gruntfile.js', 'src/assets/js/**/*.js', '!src/assets/js/lib/**/*.js'],
      
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'src/',
          livereload: true
        }
      }
    },
    watch: {
      scss: {
        files: ['src/**/*.scss'],
        //tasks: ['scsslint', 'compass'],
        tasks: ['compass'],       
        options: {
          livereload: true,
        }
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['jshint'],
        options: {
          //interrupt: true,
          livereload: true,
        },
      },
      html: {
        files: ['src/**/*.html'], 
        options: {
          livereload: true,
        }
      }
    },
    
    //want to use this once unhooked compass...
    postcss: {
      options: {
          map: true, //inline source mapping
          processors: [
            require('autoprefixer-core')({
              browsers: ['last 2 versions']
            })
          ]
      },
      dist: {
        src: 'css/*.css'
      }
    }

  });

  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', ['connect', 'watch', 'compass']);
  grunt.registerTask('lint', ['scsslint', 'jshint']);


  //grunt.loadNpmTasks('grunt-postcss');
  //grunt.registerTask('postcss', ['postcss:dist']);
};


