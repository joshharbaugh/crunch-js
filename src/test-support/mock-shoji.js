'use strict'

var shojiMod = require('../shoji/index')
    , mocks = require('angular-mocks')
    ;

exports.registerModule = function() {
    angular.mock.module(shojiMod().name)
}

exports.getShojiObj = function(rawData) {
    var shojiObj
        ;

    angular.mock.inject(function(Shoji) {
        shojiObj = Shoji(rawData.self).parse(rawData)
    })

    return shojiObj
}
