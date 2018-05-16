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
                src: ['src/base.css'],
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
                src: ['src/*.js', 'src/js/*.js'],
                dest: 'public/<%= pkg.name %>.js'
            }
        },
        concat_css: {
            all: {
                src: ["src/css/*.css", "src/css/themes/*.css"],
                dest: "public/css/styles.css"
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
        },
        watch: {
            scripts: {
                files: ['src/*.js', 'src/js/*.js', 'src/*.html','src/css/*.css', 'src/css/themes/*.css'],
                tasks: ['copy', 'jshint', 'concat', 'concat_css'],
                options: {
                    spawn: false,
                },
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['copy', 'jshint', 'concat', 'concat_css']);

};