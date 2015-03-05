'use strict';

module.exports = buildModule

function buildModule(moduleName, cfg) {
    moduleName = moduleName || 'dataset-context';
    var mod = angular.module(moduleName, [])

    mod.factory('lodash', function() {
        return require('lodash')
    })

    mod.factory('currentDataset', require('./current-dataset'))

    return mod
}
