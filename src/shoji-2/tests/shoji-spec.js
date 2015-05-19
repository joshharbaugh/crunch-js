'use strict'

require('angular-mocks')

var mainMod = require('../index')
    , entityFixture = require('./entity-fixture')
    , entityLargeFixture = require('./entity-large-fixture')
    , catalogFixture = require('./catalog-fixture')
    , httpSupport = require('./http-support')
    ;

describe('Shoji', function() {
    var Shoji
        ;

    function buildModule() {
        var mod = mainMod()
            ;

        angular.mock.module(mod.name)
    }

    function buildSut() {
        angular.mock.inject(function(_Shoji_) {
            Shoji = _Shoji_
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    context('Given a shoji object URI', function() {
        var sut
            ;

        beforeEach(function() {
            sut = Shoji(entityFixture.self)
        })

        context('When fetching the object representation', function() {
            var mapped
                ;

            beforeEach(function() {
                httpSupport.expectGETFixture('entity-fixture')
                sut.map().then(function(m) {
                    mapped = m
                })
                httpSupport.flushAndCheckExpectations()
            })

            it('should request and parse the object representation', function() {
                expect(mapped).to.deep.contain(entityFixture.body)
                expect(mapped.element).to.equal(entityFixture.element)
            })
        })
    })

    context('Given a shoji object', function() {
        var sut
            , mapped
            ;

        beforeEach(function() {
            sut = Shoji(entityLargeFixture.self)
        })

        beforeEach(function() {
            httpSupport.expectGETFixture('entity-large-fixture')
            sut.map().then(function(m) {
                mapped = m
            })
            httpSupport.flushAndCheckExpectations()
        })

        it('should expose its urls', function() {
            Object.keys(mapped.urls).forEach(function(object, key) {
                expect(entityLargeFixture.urls[key + '_url']).to.equal(object.self)
            })
        })

        it('should expose its fragments', function() {
            Object.keys(mapped.fragments).forEach(function(object, key) {
                expect(entityLargeFixture.fragments[key]).to.equal(object.self)
            })
        })

        it('should expose its views', function() {
            Object.keys(mapped.views).forEach(function(object, key) {
                expect(entityLargeFixture.views[key]).to.equal(object.self)
            })
        })

        it('should expose its catalogs', function() {
            Object.keys(mapped.catalogs).forEach(function(object, key) {
                expect(entityLargeFixture.catalogs[key]).to.equal(object.self)
            })
        })
    })

    context('Given a shoji catalog object', function() {
        var sut
            , mapped
            ;

        beforeEach(function() {
            sut = Shoji(catalogFixture.self)
        })

        beforeEach(function() {
            httpSupport.expectGETFixture('catalog-fixture')
            sut.map().then(function(m) {
                mapped = m
            })
            httpSupport.flushAndCheckExpectations()
        })

        it('should expose its index', function() {
            Object.keys(catalogFixture.index).forEach(function(key) {
                expect(mapped.index.hasOwnProperty([key]))
            })
        })

        it('should expose its orders', function() {
            Object.keys(catalogFixture.orders).forEach(function(key) {
                expect(mapped.orders[key].self).to.equal(catalogFixture.orders[key])
            })
        })

        it('should allow to map each tuple to its related entity', function() {
            Object.keys(catalogFixture.index).forEach(function(tupleSelf) {
                httpSupport.expectGETUrl((catalogFixture.self + tupleSelf), { element : 'shoji:entity', body : {} })
            })

            mapped.index.values.map(function(tuple) {
                return tuple.map()
            })

            httpSupport.flushAndCheckExpectations()
        })
    })

    context('When posting to a shoji object', function() {
        var sut
            , newResource
            ;

        beforeEach(function() {
            sut = Shoji(catalogFixture.self)
            newResource = {
                name : 'new resource'
            }
        })

        it('should send the post request', function() {
            httpSupport.expectPOST(catalogFixture.self, newResource, {
                Location : '/variables/self'
            })
            sut.save({
                data : newResource
            })
            httpSupport.flushAndCheckExpectations()
        })

        it('should create a new shoji object based on the Location header returned by the server', function() {
            httpSupport.expectPOST(catalogFixture.self, newResource, {
                Location : '/variables/self'
            })
            sut.save({
                data : newResource
            }).then(function(newResource) {
                expect(newResource.self).to.equal('/variables/self')
            })
            httpSupport.flushAndCheckExpectations()
        })
    })
})