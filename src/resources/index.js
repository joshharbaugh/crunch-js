'use strict'

module.exports = buildModule

function buildModule(moduleName, cfg) {
    var angular = require('angular')
        ,_ = require('lodash')
        ;

    var defaultCfg = {
        cacheable: false
    };
    cfg = _.extend({}, defaultCfg, cfg);

    var mod = angular.module(moduleName || 'resources', []);

    mod.factory('iResourceUser', require('./i-resource-user'));
    mod.factory('iResourceUsers', require( './i-resource-users'));
    mod.factory('iResourceAccount', require( './i-resource-account'));
    mod.factory('iResourceDatasets', require( './i-resource-datasets'));
    mod.factory('iResourceDataset', require( './i-resource-dataset'));
    mod.factory('iResourceVariables', require( './i-resource-variables'));
    mod.factory('iResourceVariable', require( './i-resource-variable'));
    mod.factory('iResourceBatches',require('./i-resource-batches'))
    mod.factory('iResourceBatch', require('./i-resource-batch'))
    mod.factory('iResourceSource', require('./i-resource-source'))

    return mod
}
