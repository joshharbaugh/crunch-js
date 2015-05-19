'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , entityFixture = require('./entity-fixture')
    ;

describe('shojiParser', function() {
    var sut
        , ShojiEntity
        ;

    function buildModule() {
        var mod = mainMod()
            ;

        angular.mock.module(mod.name)
    }

    function buildSut() {
        angular.mock.inject(function(shojiParser, _ShojiEntity_) {
            sut = shojiParser
            ShojiEntity = _ShojiEntity_
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    it('should parse element shoji:entity to ShojiEntity objects', function() {
        expect(sut.parse(entityFixture) instanceof ShojiEntity).to.be.true
    })
})