'use strict'

module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        tests : {
            supportFiles : 'test-support/index.js',
            supportFilesBuild : 'build/test-support.js'
        },
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

            singleTest : {
                options : {
                    external : ['angular', 'angular-mocks']
                },
                src : [
                    '<%= grunt.option("file") %>'
                ],
                dest : '<%= pkg.buildFile %>'
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

    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-karma')

    grunt.registerTask('test:single', 'Run a single unit test suite', [
        'browserify:testSupport',
        'browserify:singleTest',
        'karma:dev'
    ])
}