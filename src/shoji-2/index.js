'use strict'

module.exports = buildModule

function buildModule() {
    var angular = require('angular')
        , mod = angular.module('shoji-2', [])
        ;

    mod.factory('Shoji', require('./shoji'))
    mod.factory('ShojiObject', require('./shoji-object'))
    mod.factory('ShojiEntity', require('./shoji-entity'))
    mod.factory('shojiDataOperations', require('./shoji-data-operations'))
    mod.factory('shojiParser', require('./shoji-parser'))

    mod.factory('lodash', function() {
        return require('lodash')
    })

    mod.factory('assert', function() {
        return console.assert.bind(console)
    })

    return mod
}