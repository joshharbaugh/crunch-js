'use strict'

module.exports = buildModule

function buildModule(name) {
    var angular = require('angular')
        , mod = angular.module((name || 'shoji'), [])
        ;

    mod.factory('Shoji', require('./shoji'))
    mod.factory('ShojiObject', require('./shoji-object'))
    mod.factory('ShojiEntity', require('./shoji-entity'))
    mod.factory('ShojiCatalog', require('./shoji-catalog'))
    mod.factory('ShojiView', require('./shoji-view'))
    mod.factory('ShojiOrder', require('./shoji-order'))
    mod.factory('shojiDataOperations', require('./shoji-data-operations'))
    mod.factory('shojiParser', require('./shoji-parser'))

    mod.factory('lodash', function() {
        return require('lodash')
    })

    mod.factory('url', function() {
        return require('url')
    })

    mod.factory('assert', function() {
        return console.assert.bind(console)
    })

    return mod
}