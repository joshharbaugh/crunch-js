'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    ;

describe('analysisGeneratorFactory', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(analysisGeneratorFactory) {
            sut = analysisGeneratorFactory
        })
    }
})
