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
            js : {
                src : 'index.js',
                tmp : '<%= pkg.directories.tmp %>/crunch.js',
                dest: '<%= pkg.directories.dist %>/crunch.js'
            },
            html : {
                src : '<%= pkg.directories.src %>/**/*.html',
                tmp : '<%= pkg.directories.tmp %>/templates.js',
                dest: '<%= pkg.directories.dist %>/templates.js'
            }
        },
        clean : {
            dev : {
                src : ['<%= pkg.directories.build %>']
            },
            dist : {
                src : ['<%= pkg.directories.dist %>']
            },
            tmp : {
                src : ['<%= pkg.directories.tmp %>']
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

        createTplBundle : {
            dist : {
                src:  ['<%= dist.html.src %>'],
                dest: '<%= dist.html.tmp %>'
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
            },

            dist : {
                options : {
                    alias : [
                        './test-support/angular-shim.js:angular',
                        './test-support/angular-mocks-shim.js:angular-mocks'
                    ]
                },
                src : [
                    '<%= dist.js.src %>'
                ],
                dest : '<%= dist.js.tmp %>'
            }

            , distTpl : {
                options : {
                    external : ['angular', 'angular-mocks'],
                    transform : ['html2js-browserify']
                },
                src : ['<%= dist.html.tmp %>'],
                dest : '<%= dist.html.tmp %>'
            }
        },

        uglify : {
            dist : {
                files : {
                    '<%= dist.js.dest %>' : ['<%= dist.js.tmp %>']
                }
            }

            , distTpl : {
                files : {
                    '<%= dist.html.dest %>' : ['<%= dist.html.tmp %>']
                }
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
                    browsers:  ['Chrome'],
                    singleRun: true
                }
            }
        },

        copy : {
            examples : {
                files: {
                    'examples/crunch.js' : ['<%= dist.js.dest %>'],
                    'examples/templates.js' : ['<%= dist.html.dest %>']
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-karma')

    grunt.registerMultiTask('createTplBundle', function buildTemplates() {
        var buildModuleTpl = grunt.file.read('./lib/templates-builder.tpl')
            ;

        this.files.forEach(function(fileCfg) {
            var dest = fileCfg.dest
                , sources = fileCfg.src
                , bundle
                ;

            bundle = grunt.template.process(buildModuleTpl, {
                data : {
                    tpls : sources.map(function(source) {
                        return { name : source.replace('src', ''), path : source }
                    })
                }
            })

            grunt.file.write(dest, bundle)
        })
    })

    grunt.registerTask('test', 'Run test suites', [
        'clean:dev',
        'browserify:testSupport',
        'browserify:dev',
        'karma:dev'
    ])

    grunt.registerTask('buildTemplates', [
        'createTplBundle',
        'browserify:distTpl',
        'uglify:distTpl'
    ])

    grunt.registerTask('buildJS', [
        'browserify:testSupport',
        'browserify:dev',
        'karma:prod',
        'browserify:dist',
        'uglify:dist'
    ])

    grunt.registerTask('build', 'Creates a new build', [
        'clean',
        'buildJS',
        'buildTemplates',
        'clean:dev',
        'clean:tmp',
        'copy:examples'
    ])
}