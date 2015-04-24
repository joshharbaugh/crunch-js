'use strict'

var filterTestFile = require('./lib/filter-test-file')
    ;

module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        baseDirs : {
            src : 'src',
            build : 'build',
            support : 'test-support',
            dist : 'dist',
            tmp : 'tmp'
        },
        externalAssets : {
            jquery : 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
            angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.10/angular.min.js',
            mocks:   'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.10/angular-mocks.js'
        },
        src : {
            tests : {
                supportFiles : '<%= baseDirs.support %>/index.js',
                specs : '<%= baseDirs.src %>/**/*-spec.js'
            },
            lib : {
                index : 'index.js'
            }
        },
        build : {
            tests : {
                base : '<%= baseDirs.build %>/tests',
                supportFiles : '<%= build.tests.base %>/test-support.js',
                specs : '<%= build.tests.base %>/specs.js'
            },
            lib : {
                base : '<%= baseDirs.build %>/dist',
                index : '<%= baseDirs.build %>/dist/lib.js'
            }
        },
        dist : {
            lib : {
                dest: '<%= baseDirs.dist %>/crunch.js'
            }
        },
        clean : {
            test : {
                src : ['<%= build.tests.base %>']
            },
            tmp : {
                src : ['<%= baseDirs.tmp %>']
            },
            dist : {
                src : ['<%= build.lib.base %>', '<%= baseDirs.dist %>']
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
            buildTestSupport : {
                src : ['<%= src.tests.supportFiles %>'],
                dest : '<%= build.tests.supportFiles %>'
            },

            buildSpecs : {
                options : {
                    watch : true,
                    external : ['angular', 'angular-mocks'],
                    browserifyOptions : {
                      debug : true
                    }
                },
                src : ['<%= src.tests.specs %>'],
                dest : '<%= build.tests.specs %>',
                filter : function(filepath) {
                    var options = {
                            file:     grunt.option('file'),
                            features: grunt.option('features')
                        }
                        ;

                    return filterTestFile(filepath, options)
                },
                travis: {
                    options : {
                        'watch':false
                    }
                }
            },

            buildLib : {
                src : ['<%= src.lib.index %>'],
                dest : '<%= build.lib.index %>'
            }
        },

        uglify : {
            options : {
                sourceMap : true
            },
            dist : {
                files : {
                    '<%= dist.lib.dest %>' : ['<%= build.lib.index %>']
                }
            }
        },

        stylus : {
            options : {
                use : ['nib']
            },
            dist : {
                src : ['<%= src.styles.class %>'],
                dest : '<%= dist.styles.dest %>'
            }
        },

        karma : {
            options : {
                files: [
                    '<%= externalAssets.jquery %>',
                    '<%= externalAssets.angular %>',
                    '<%= externalAssets.mocks %>',
                    '<%= build.tests.supportFiles %>',
                    '<%= build.tests.specs %>'
                ]
            },

            dev : {
                options : {
                    configFile: 'config/karma.conf.js',
                    browsers: ['Chrome']
                }
            },

            prod : {
                options : {
                    browsers:  ['Chrome'],
                    singleRun: true
                }
            },
            travis: {
                options : {
                    configFile: 'config/karma.travis.conf.js',
                    singleRun: true,
                    browsers: ['Firefox']
                }
            }
        },

        copy : {
            examples : {
                files: {
                    'examples/crunch.js' : ['<%= dist.lib.dest %>']
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-release')
    grunt.loadNpmTasks('grunt-karma')

    grunt.registerTask('buildTest', 'Creates spec and test support bundles that will be processed by karma', [
        'clean:test',
        'browserify:buildTestSupport',
        'browserify:buildSpecs'
    ])

    grunt.registerTask('buildTest:travis', 'Creates spec and test support bundles that will be processed by karma', [
        'clean:test',
        'browserify:buildTestSupport',
        'browserify:buildSpecs:travis'
    ])

    grunt.registerTask('test', 'Run test suite in development mode. Watches for file changes and re-run the tests.', [
        'buildTest',
        'karma:dev'
    ])

    grunt.registerTask('test', 'Run test suite on travis.', [
        'buildTest:travis',
        'karma:travis'
    ])

    grunt.registerTask('test:ci', 'Run test suite in CI mode. After the first run karma stops.', [
        'buildTest:travis',
        'karma:prod'
    ])

    grunt.registerTask('buildDist', [
        'browserify:buildLib',
        'uglify:dist',
        'clean:tmp',
        'copy:examples'
    ])

    grunt.registerTask('dist', [
        'clean:tmp',
        'clean:dist',
        'test:ci',
        'buildDist'
    ])

    grunt.registerTask('default', 'Runs dist task', ['dist'])
}