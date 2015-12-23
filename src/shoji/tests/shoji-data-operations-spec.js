'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , httpSupport = require('./http-support')
    , entityFixture = require('./entity-fixture')
    , catalogFixture = require('./catalog-fixture')
    ;

describe('shojiDataOperations', function() {
    var sut
        ;

    function buildModule() {
        var mod = mainMod('shoji', { skipInterceptors : true })
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

    it('should perform POST requests', function() {
        var data = { name : 'new resource' }
        httpSupport.expectPOST(catalogFixture.self, data, { Location : '/newresource' })
        sut.post(catalogFixture.self, { data : data })
        httpSupport.flushAndCheckExpectations()
    })

    it('should perform PUT requests', function() {
        var data = { name : 'new resource' }
        httpSupport.expectPUT(catalogFixture.self, data)
        sut.put(catalogFixture.self, { data : data })
        httpSupport.flushAndCheckExpectations()
    })

    it('should perform PATCH requests', function() {
        var data = { name : 'new resource' }
        httpSupport.expectPATCH(catalogFixture.self, data)
        sut.patch(catalogFixture.self, { data : data })
        httpSupport.flushAndCheckExpectations()
    })

    it('should perform DELETE requests', function() {
        httpSupport.expectDELETE(catalogFixture.self)
        sut.delete(catalogFixture.self)
        httpSupport.flushAndCheckExpectations()
    })
})