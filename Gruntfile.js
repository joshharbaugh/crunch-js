'use strict'

module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        jshint : {
            options : {
                jshintrc: true
            },
            dev : {
                src : ['lib/**/*.js']
            }
        }
    })

    grunt.loadNpmTasks(
        'grunt-contrib-jshint'
    )
}