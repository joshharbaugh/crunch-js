'use strict'

var filterTestFile = require('./lib/filter-test-file')
    , path = require('path')
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
            templates : {
                ngTemplates : '<%= baseDirs.src %>/**/*.html'
            },
            lib : {
                entry : '<%= baseDirs.src %>/crunch/index.js'
            },
            styles : {
                'class' : '<%= baseDirs.src %>/**/*.styl'
            }
        },
        build : {
            tests : {
                base : '<%= baseDirs.build %>/tests',
                supportFiles : '<%= build.tests.base %>/test-support.js',
                specs : '<%= build.tests.base %>/specs.js'
            },
            dist : {
                base : '<%= baseDirs.build %>/dist',
                ngTemplates : '<%= baseDirs.build %>/dist/ngTemplates.js',
                lib : '<%= baseDirs.build %>/dist/lib.js'
            }
        },
        tmp : {
            templates : {
                ngTemplates : '<%= baseDirs.tmp %>/templates/templateBundler.js'
            },
            dist : {
                bundle : '<%= baseDirs.tmp %>/bundle/crunch.js'
            }
        },
        dist : {
            js : {
                dest: '<%= baseDirs.dist %>/crunch.js'
            },
            styles : {
                dest : '<%= baseDirs.dist %>/crunch.css'
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
                src : ['<%= build.dist.base %>', '<%= baseDirs.dist %>']
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
                src :  ['<%= src.templates.ngTemplates %>'],
                dest:   '<%= tmp.templates.ngTemplates %>'
            }
        },

        browserify : {
            options : {
                alias : [
                    './test-support/angular-shim.js:angular',
                    './test-support/angular-mocks-shim.js:angular-mocks'
                ],
                transform : ['html2js-browserify']
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
                }
            },

            buildNgTemplates : {
                options : {
                    external : ['angular', 'angular-mocks'],
                    transform : ['html2js-browserify']
                },
                src : ['<%= tmp.templates.ngTemplates  %>'],
                dest : '<%= build.dist.ngTemplates %>'
            },

            buildLib : {
                src : ['<%= src.lib.entry %>'],
                dest : '<%= build.dist.lib %>'
            }
        },

        concat : {
            dist : {
                src : ['<%= build.dist.lib %>', '<%= build.dist.ngTemplates %>'],
                dest : '<%= tmp.dist.bundle %>'
            }
        },

        uglify : {
            dist : {
                files : {
                    '<%= dist.js.dest %>' : ['<%= tmp.dist.bundle %>']
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
                configFile: 'karma.conf.js',
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
                    'examples/crunch.css' : ['<%= dist.styles.dest %>']
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-release')
    grunt.loadNpmTasks('grunt-karma')

    grunt.registerMultiTask('createTplBundle', function buildTemplates() {
        var buildModuleTpl = grunt.file.read('./lib/templates-builder.tpl')
            ;

        this.files.forEach(function(fileCfg) {
            var dest = fileCfg.dest
                , sources = fileCfg.src
                , bundle
                , root = process.cwd()
                ;

            bundle = grunt.template.process(buildModuleTpl, {
                data : {
                    tpls : sources.map(function(source) {
                        return {
                            name : source.replace('src', '')
                            , path : path.join(root, source)
                        }
                    })
                }
            })

            grunt.file.write(dest, bundle)
        })
    })

    grunt.registerTask('buildTest', 'Creates spec and test support bundles that will be processed by karma', [
        'clean:test',
        'browserify:buildTestSupport',
        'browserify:buildSpecs'
    ])

    grunt.registerTask('test', 'Run test suite in development mode. Watches for file changes and re-run the tests.', [
        'buildTest',
        'karma:dev'
    ])

    grunt.registerTask('test:ci', 'Run test suite in CI mode. After the first run karma stops.', [
        'buildTest',
        'karma:prod'
    ])

    grunt.registerTask('buildTemplates', [
        'createTplBundle',
        'browserify:buildNgTemplates'
    ])

    grunt.registerTask('buildDist', [
        'clean:tmp',
        'clean:dist',
        'buildTemplates',
        'browserify:buildLib',
        'concat:dist',
        'uglify:dist',
        'stylus:dist',
        'clean:tmp'
    ])

    grunt.registerTask('default', 'Creates a new build', [
        'test:ci',
        'buildDist',
        'copy:examples'
    ])
}