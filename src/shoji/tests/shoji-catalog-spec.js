'use strict'

require('angular-mocks')

var mainMod = require('../index')
    , catalogFixture = require('./catalog-fixture')
    ;

describe('ShojiCatalog', function() {
    var sut
        ;

    function buildModule() {
        var mod = mainMod()
            ;

        angular.mock.module(mod.name)
    }

    function buildSut() {
        angular.mock.inject(function(ShojiCatalog) {
            sut = new ShojiCatalog(catalogFixture.self).parse(catalogFixture)
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    it('should expose a property self for each tuple', function() {
        Object.keys(catalogFixture.index).forEach(function(self) {
            expect(catalogFixture.self + self).to.equal(sut.index[self].self)
        })
    })
})