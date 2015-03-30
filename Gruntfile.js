'use strict'

var filterTestFile = require('./lib/filter-test-file')
    ;

module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        tests : {
            src : './src/**/*-spec.js',
            supportFiles : 'test-support/index.js',
            supportFilesBuild : '<%= pkg.directories.build %>/test-support.js'
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
            testSupport : {
                options : {
                    alias : [
                        './test-support/angular-shim.js:angular',
                        './test-support/angular-mocks-shim.js:angular-mocks'
                    ]
                },
                src : [
                    '<%= tests.supportFiles %>'
                ],
                dest : '<%= tests.supportFilesBuild %>'
            },

            dev : {
                options : {
                    watch : true,
                    external : ['angular', 'angular-mocks']
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
        },

        karma : {
            dev : {
                options: {
                    configFile: 'karma.conf.js',
                    files: [
                        '<%= pkg.assets.angular %>',
                        '<%= pkg.assets.angularMocks %>',
                        '<%= tests.supportFilesBuild %>',
                        '<%= pkg.buildFile %>'
                    ],
                    browsers: ['Chrome']
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
}