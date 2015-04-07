'use strict'

module.exports = function buildModule(excludes) {
    var angular = require('angular')
        , features = [
            require('../shoji')
            , require('../resources')
            , require('../messaging')
            , require('../machina-angular')
            , require('../current-dataset')
            , require('../traversable')
            , require('../drag-and-drop')
            , require('../hierarchical-variables')
            , require('../hierarchical-variables-list')
            , require('../analysis')
            , require('../cube')
            , require('../start-from')
        ]
        , mod
        ;

    var modules = features
        .map(function(feat) {
            return feat().name
        })
        .filter(function(modName) {
            return (excludes || []).indexOf(modName) === -1
        })

    mod = angular.module('crunchJS', modules)

  return mod
}