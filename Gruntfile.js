'use strict'

var filterTestFile = require('./lib/filter-test-file')
    ;

module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        tests : {
            src : '<%= pkg.directories.src %>/**/*-spec.js',
            supportFiles : 'test-support/index.js',
            supportFilesBuild : '<%= pkg.directories.build %>/test-support.js'
        },
        dist : {
            srcJs : 'index.js',
            distFile : '<%= pkg.directories.dist%>/crunch.js'
        },
        clean : {
            dev : {
                src : ['<%= pkg.directories.build %>']
            },
            dist : {
                src : ['<%= pkg.directories.dist %>']
            }
        }
        ,
        jshint : {
            options : {
                jshintrc: true
            },
            dev : {
                src : ['lib/**/*.js']
            }
        },
        browserify : {
            options : {
                alias : [
                    './test-support/angular-shim.js:angular',
                    './test-support/angular-mocks-shim.js:angular-mocks'
                ]
            },
            testSupport : {
                src : [
                    '<%= tests.supportFiles %>'
                ],
                dest : '<%= tests.supportFilesBuild %>'
            },

            dev : {
                options : {
                    watch : true,
                    external : ['angular', 'angular-mocks'],
                    transform : ['html2js-browserify']

                },
                src : [
                    '<%= tests.src %>'
                ],
                dest : '<%= pkg.buildFile %>',
                filter : function(filepath) {
                    var options = {
                            file:     grunt.option('file'),
                            features: grunt.option('features')
                        }
                        ;

                    return filterTestFile(filepath, options)
                }
            }

            , dist : {
                options : {
                    transform : ['browserify-ng-html2js']
                }
                ,
                src : [
                    '<%= dist.srcJs %>'
                ],
                dest : '<%= dist.distFile %>'
            }
        },

        karma : {
            options : {
                configFile: 'karma.conf.js',
                files: [
                    '<%= pkg.assets.jquery %>',
                    '<%= pkg.assets.angular %>',
                    '<%= pkg.assets.angularMocks %>',
                    '<%= tests.supportFilesBuild %>',
                    '<%= pkg.buildFile %>'
                ]
            },

            dev : {
                options : {
                    browsers: ['Chrome']
                }
            },

            prod : {
                options : {
                    browsers:  ['Chrome', 'Firefox'],
                    singleRun: true
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-karma')

    grunt.registerTask('test', 'Run test suites', [
        'clean:dev',
        'browserify:testSupport',
        'browserify:dev',
        'karma:dev'
    ])

    grunt.registerTask('build', 'Creates a new build', [
        'clean',
        'browserify:testSupport',
        'browserify:dev',
        'karma:prod',
        'clean',
        'browserify:dist'
    ])
}