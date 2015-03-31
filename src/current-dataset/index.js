'use strict';

module.exports = buildModule

function buildModule(moduleName) {
    var angular = require('angular')
        ;

    moduleName = moduleName || 'current-dataset'

    var mod = angular.module(moduleName, [])

    mod.factory('lodash', function() {
        return require('lodash')
    })

    mod.factory('currentDataset', require('./current-dataset'))


    return mod
}
