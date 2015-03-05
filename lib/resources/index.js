'use strict'

module.exports = buildModule

function buildModule(moduleName, cfg) {
    var _ = require('lodash')
        ;

    var mod = angular.module(moduleName || 'resources', [])

    mod.factory('iResourceDataset', require( './i-resource-dataset'))
    mod.factory('iResourceDatasets', require('./i-resource-datasets'))
    mod.factory('iResourceUser', require('./i-resource-user'))

    return mod
}
