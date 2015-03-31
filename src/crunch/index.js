'use strict'

module.exports = function buildModule() {
    var angular = require('angular')
        , features = [
            require('../shoji')
            , require('../machina-angular')
            , require('../traversable')
            , require('../drag-and-drop')
            , require('../hierarchical-variables')
            , require('../hierarchical-variables-list')
            , require('../analysis')
            , require('../cube')
        ]
        ;

    angular.module('crunchJS', features.map(function(feat) {
        return feat().name
    }))
}