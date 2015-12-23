'use strict'

module.exports = buildModule

function buildModule(name, cfg) {
    var angular = require('angular')
        , mod = angular.module((name || 'shoji'), [])
        ;

    cfg = cfg || {}

    mod.factory('Shoji', require('./shoji'))
    mod.factory('ShojiObject', require('./shoji-object'))
    mod.factory('ShojiEntity', require('./shoji-entity'))
    mod.factory('ShojiCatalog', require('./shoji-catalog'))
    mod.factory('ShojiView', require('./shoji-view'))
    mod.factory('ShojiOrder', require('./shoji-order'))
    mod.factory('shojiDataOperations', require('./shoji-data-operations'))
    mod.factory('shojiParser', require('./shoji-parser'))

    mod.provider('shojiRequestInterceptor', require('./shoji-request-interceptor'))

    if(!cfg.skipInterceptors) {
        mod.config(['$provide', 'shojiRequestInterceptorProvider', function($provide, decorator) {
            $provide.decorator('shojiDataOperations', decorator.$get)
        }])
    }

    mod.factory('lodash', function() {
        return require('lodash')
    })

    mod.factory('url', function() {
        return require('url')
    })

    mod.factory('assert', function() {
        return function assert(assertion, message) {
            if(!assertion) {
                throw new Error(message)
            }
        }
    })

    return mod
}