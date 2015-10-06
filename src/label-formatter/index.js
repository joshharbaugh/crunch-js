'use strict'

module.exports = buildModule

function buildModule(moduleName) {
    var angular = require('angular')
        ,_ = require('lodash')

    var mod = angular.module(moduleName || 'label-formatter', [])

    mod.factory('lodash', function() {
        return _
    })

    mod.factory('labelFormatter', require('./label-formatter'))
    return mod
}