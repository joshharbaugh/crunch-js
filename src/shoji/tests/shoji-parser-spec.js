'use strict'

require('angular-mocks')

var mainMod = require('../index')
    , entityFixture = require('./entity-fixture')
    , catalogFixture = require('./catalog-fixture')
    ;

describe('shojiParser', function() {
    var sut
        , ShojiEntity
        , ShojiCatalog
        ;

    function buildModule() {
        var mod = mainMod()
            ;

        angular.mock.module(mod.name)
    }

    function buildSut() {
        angular.mock.inject(function(shojiParser, _ShojiEntity_, _ShojiCatalog_) {
            sut = shojiParser
            ShojiEntity = _ShojiEntity_
            ShojiCatalog = _ShojiCatalog_
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    it('should parse element shoji:entity to ShojiEntity objects', function() {
        expect(sut.parse(entityFixture) instanceof ShojiEntity).to.be.true
    })

    it('should parse element shoji:catalog to ShojiCatalog objects', function() {
        expect(sut.parse(catalogFixture) instanceof ShojiCatalog).to.be.true
    })
})