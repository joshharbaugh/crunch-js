'use strict';
/** @module shoji
 * @desc Exposes the shoji client.  For details on the shoji JSON spec, please visit [here](http://aminusfu.com/shoji)
 * */
module.exports = function buildModule(moduleName, cfg) {
    var angular = require('angular')
        ,_ = require('lodash');
    moduleName = moduleName || 'shoji';
    var defaults = {
         offline: false
    };
    cfg = _.extend({}, defaults, cfg);
    var shoji = angular.module(moduleName, []);
    shoji.constant('SHOJI_CFG', cfg);
    shoji.factory('lodash', function() {
        return _
    })
    shoji.factory('url', function() {
        return require('url')
    })

    shoji.provider('shojiDataStrategy', require( './shoji-http-data-strategy'));
    shoji.factory('Shoji', require('./shoji-resource-factory'));
    shoji.factory('shojiParser', require('./shoji-parser'));
    shoji.factory('shojiSerializer', require( './shoji-serializer'));
    shoji.factory('ShojiCollection', require( './shoji-collection-factory'));

    shoji.factory('ShojiCatalogIndex',require('./shoji-catalog-index'))
    shoji.factory('ShojiTuple',require('./shoji-tuple'))

    return shoji

}
