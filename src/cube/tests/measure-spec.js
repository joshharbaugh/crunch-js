'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    ;

describe('measure', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;


        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(measure) {
            sut = measure
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)
})

