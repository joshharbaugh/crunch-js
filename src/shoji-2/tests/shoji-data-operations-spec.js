'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , httpSupport = require('./http-support')
    , entityFixture = require('./entity-fixture')
    ;

describe('shojiDataOperations', function() {
    var sut
        ;

    function buildModule() {
        var mod = mainMod()
            ;

        angular.mock.module(mod.name)
    }

    function buildSut() {
        angular.mock.inject(function(shojiDataOperations) {
            sut = shojiDataOperations
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    it('should perform get requests', function() {
        httpSupport.expectGETFixture('entity-fixture')
        sut.get(entityFixture.self).then(function(data) {
            expect(data).to.deep.equal(entityFixture)
        })
        httpSupport.flushAndCheckExpectations()
    })
})