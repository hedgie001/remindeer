module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            assets: {
                expand: true,
                flatten: true,
                src: ['src/assets/images/**'],
                dest: 'public/img/',
                filter: 'isFile'
            },
            fonts: {
                expand: true,
                flatten: true,
                src: ['src/assets/fonts/**'],
                dest: 'public/fonts/',
                filter: 'isFile'
            },
            mustache: {
                expand: true,
                flatten: true,
                src: ['node_modules/mustache/mustache.min.js'],
                dest: 'public/libs/'
            },
            moment: {
                expand: true,
                flatten: true,
                src: ['node_modules/moment/min/moment-with-locales.min.js'],
                dest: 'public/libs/'
            },
            rome: {
                expand: true,
                flatten: true,
                src: ['node_modules/rome/dist/rome.min.js', 'node_modules/rome/dist/rome.min.css'],
                dest: 'public/libs/'
            },
            materialDatetimePicker: {
                expand: true,
                flatten: true,
                src: ['node_modules/material-datetime-picker/dist/material-datetime-picker.js', 'node_modules/material-datetime-picker/dist/material-datetime-picker.css'],
                dest: 'public/libs/'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/index.js','src/controllers/*.js', 'src/models/*.js'],
                dest: 'public/<%= pkg.name %>.js'
            }
        },
        includes: {
            build: {
                cwd: 'src/views',
                src: ['*.html'],
                dest: 'public/',
                options: {
                    flatten: true,
                    includePath: 'src/views'
                }
            },
        },
        concat_css: {
            all: {
                src: ["src/assets/css/*.css", "src/assets/css/themes/*.css"],
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
                },
                esversion: 6
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js', 'src/controllers/*.js', 'src/models/*.js', 'src/views/*.html','src/assets/css/*.css', 'src/assets/css/themes/*.css'],
                tasks: ['copy', 'jshint', 'concat', 'concat_css', 'includes', 'clean'],
                options: {
                    spawn: false,
                },
            },
        },
        clean: {
            html: ['public/*.html', '!public/index.html']
        },
        connect: {
            server: {
                keepalive: true,
                options: {
                    port: 1337,
                    base: 'public/',
                    keepalve: true,
                    open: true
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['copy', 'jshint', 'concat', 'concat_css', 'includes', 'clean', 'connect:server:keepalive']);

};