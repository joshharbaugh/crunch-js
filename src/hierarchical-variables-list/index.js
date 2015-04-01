'use strict';

module.exports = buildModule

function buildModule(moduleName) {
    var angular = require('angular')

    var mod = angular.module(moduleName || 'hierarchical-variables-list',[])

    mod.factory('lodash', function() {
        return require('lodash')
    })

    mod.factory('assert', function() {
        return console.assert.bind(console)
    })

    mod.factory('HierarchicalVariablesList',require('./hierarchical-variables-list'))
    mod.factory('HierarchicalGroup',require('./hierarchical-group'))
    mod.factory('HierarchicalVariable',require('./hierarchical-variable'))
    mod.factory('hierarchicalBehaviors',require('./hierarchical-behaviors'))

    return mod
}
