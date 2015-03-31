'use strict';

module.exports = buildModule

function buildModule(moduleName) {
    var angular = require('angular')
    var mod = angular.module(moduleName || 'start-from',[])
    mod.filter('startFrom',require('./start-from-filter'))
    return mod
}
