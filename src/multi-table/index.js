'use strict';
module.exports = buildModule

function buildModule(moduleName) {
    var angular = require('angular')
        ,_ = require('lodash')
    ;
    moduleName = moduleName || 'multi-table';
    var mod = angular.module(moduleName, [])

    mod.factory('MultiTable', require('./multi-table'))
    return mod
}
