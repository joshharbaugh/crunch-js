'use strict'



module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        tests : {
            src : 'lib/**/tests/*-spec.js',
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
            },

            features : {
                options : {
                    external : ['angular', 'angular-mocks']
                },
                src : [
                    '<%= tests.src %>'
                ],
                dest : '<%= pkg.buildFile %>',
                filter : function(filepath) {
                    var features = grunt.option('features') || ''
                        , featuresList = features.split(',')
                        ;

                    console.assert(featuresList.length, 'You should provide at least one feature')

                    return grunt.file.isFile(filepath) && featuresList.some(function(feat) {
                        return filepath.split('/')[1] === feat
                    })
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

    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-karma')

    grunt.registerTask('test:single', 'Run a single unit test file', [
        'browserify:testSupport',
        'browserify:singleTest',
        'karma:dev'
    ])

    grunt.registerTask('test:features', 'Run unit test suite for a specified feature', [
        'browserify:testSupport',
        'browserify:features',
        'karma:dev'
    ])
}