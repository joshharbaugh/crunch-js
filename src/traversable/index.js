'use strict';

module.exports = buildModule

function buildModule(moduleName) {
    var angular = require('angular')

    var mod = angular.module(moduleName || 'traversable',[])

    mod.factory('Traversable',require('./traversable'))
    return mod
}
