module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            assets: {
                expand: true,
                flatten: true,
                src: ['src/assets/**'],
                dest: 'public/img/',
                filter: 'isFile'
            },
            fonts: {
                expand: true,
                flatten: true,
                src: ['src/fonts/**'],
                dest: 'public/fonts/',
                filter: 'isFile'
            },
            style: {
                expand: true,
                flatten: true,
                src: ['src/style.css'],
                dest: 'public/'
            },
            html: {
                expand: true,
                flatten: true,
                src: ['src/*.html'],
                dest: 'public/'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/*.js', 'src/**/*.js'],
                dest: 'public/<%= pkg.name %>.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'public/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js', 'src/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    unused: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['copy', 'jshint', 'concat']);

};