'use strict'

var path = require('path')

module.exports = function createBuildTemplates(grunt) {
    function buildTemplates() {
        var buildModuleTpl = grunt.file.read('./lib/templates-builder.tpl')
            ;
        debugger;

        this.files.forEach(function(fileCfg) {
            var dest = fileCfg.dest
                , sources = fileCfg.src
                , bundle
                ;

            bundle = grunt.template.process(buildModuleTpl, {
                data : {
                    tpls : sources.map(function(source) {
                        console.log(source)
                        return {
                            name : source.replace('src', '')
                            , path : path.join('.', source)
                        }
                    })
                }
            })

            grunt.file.write(dest, bundle)
        })
    }

    return buildTemplates
}