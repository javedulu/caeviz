'use strict';
module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Show grunt task time
    require('time-grunt')(grunt);

    // Configurable paths for the app
    var appConfig = {
        app: 'www',
        dist: 'dist/www'
    };

    // Grunt configuration
    grunt.initConfig({

        // Project settings
        applcn: appConfig,

        // The grunt server settings
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= applcn.dist %>'
                }
            }
        },
        // Compile less to css
        less: {
            development: {
                options: {
                    compress: true,
                    optimization: 2
                },
                files: {
                    "<%= applcn.app %>/styles/style.css": "<%= applcn.app %>/less/style.less"
                }
            }
        },
        // Watch for changes in live edit
        watch: {
            styles: {
                files: ['<%= applcn.app %>/less/**/*.less'],
                tasks: ['less', 'copy:styles'],
                options: {
                    nospawn: true,
                    livereload: '<%= connect.options.livereload %>'
                },
            },
            js: {
                files: ['<%= applcn.app %>/scripts/{,*/}*.js'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= applcn.app %>/**/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= applcn.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        // If you want to turn on uglify you will need write your angular code with string-injection based syntax
        // For example this is normal syntax: function exampleCtrl ($scope, $rootScope, $location, $http){}
        // And string-injection based syntax is: ['$scope', '$rootScope', '$location', '$http', function exampleCtrl ($scope, $rootScope, $location, $http){}]
        uglify: {
            options: {
                mangle: true,
                banner: '/*! <%= grunt.template.today("mm-dd-yyyy h:MM:ss TT") %> */\n'
            }
        },
        // Clean dist folder
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= applcn.dist %>/{,*/}*',
                        '!<%= applcn.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= applcn.app %>',
                        dest: '<%= applcn.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'partials/{,*/}*.html',
                            'styles/patterns/*.*',
                            'images/{,*/}*.*',
                            'fonts/{,*/}*.*',
                            'translations/{,*/}*.*',
                            'addons/{,*/}*.*',
                            'addons/res/{,*/}*.*',
                            'data/{,*/}*.*',
                            'videos/{,*/}*.*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/fontawesome',
                        src: ['fonts/*.*'],
                        dest: '<%= applcn.dist %>'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/bootstrap',
                        src: ['fonts/*.*'],
                        dest: '<%= applcn.dist %>'
                    },
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= applcn.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.*'
            },
            assets: {
                expand: true,
                cwd: '<%= applcn.app %>/../assets/npm',
                dest: '<%= applcn.dist %>/../',
                src: '{,*/}*.*'
            },
            sslcerts: {
                expand: true,
                cwd: '<%= applcn.app %>/../ssl',
                dest: '<%= applcn.dist %>/../ssl',
                src: '{,*/}*.*'
            },
            server: {
                expand: true,
                cwd: '<%= applcn.app %>/../',
                dest: '<%= applcn.dist %>/../',
                src: 'app*.js'
            },
            licread: {
                expand: true,
                cwd: '<%= applcn.app %>/./',
                dest: '<%= applcn.dist %>/./',
                src: '{LIC*,READ*,\.git*}'
            }
        },
        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= applcn.dist %>/scripts/{,*/}*.js',
                    '<%= applcn.dist %>/styles/{,*/}*.css',
                    '<%= applcn.dist %>/styles/fonts/*'
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= applcn.dist %>',
                    src: ['*.html', 'partials/{,*/}*.html'],
                    dest: '<%= applcn.dist %>'
                }]
            }
        },
        useminPrepare: {
            html: '<%= applcn.app %>/index.html',
            options: {
                dest: '<%= applcn.dist %>'
                //flow: { steps: { 'js': ['concat'], 'css': ['concat']}, post: {}}
            }
        },
        usemin: {
            html: ['<%= applcn.dist %>/index.html']
        }
    });

    // Run live version of app
    grunt.registerTask('live', [
        'clean:server',
        'copy:styles',
        'connect:livereload',
        'watch'
    ]);

    // Run build version of app
    grunt.registerTask('server', [
        'build',
        'connect:dist:keepalive'
    ]);

    // Build version for production
    grunt.registerTask('build', [
        'clean:dist',
        //'less',
        'useminPrepare',
        'concat',
        'copy:dist',
        'copy:assets',
        'copy:server',
        'copy:licread',
        'copy:sslcerts',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
};
