'use strict'

module.exports = function buildModule() {
    var angular = require('angular')
        , features = [
            require('../machina-angular')
            , require('../shoji')
            , require('../traversable')
        ]
        ;

    angular.module('crunchJS', features.map(function(feat) {
        return feat().name
    }))
}