'use strict'

require('angular-mocks')

var mainMod = require('../index')
    , entityFixture = require('./entity-fixture')
    , entityLargeFixture = require('./entity-large-fixture')
    , catalogFixture = require('./catalog-fixture')
    , viewFixture = require('./view-fixture')
    , orderFixture = require('./order-fixture')
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

        context('When fetching the object representation with the noCache flag', function() {

            it('should request the resource with the Cache-Control header equals to no-cache', function() {
                httpSupport.expectGETFixture('entity-fixture', 200, {
                    'Cache-Control' : 'no-cache'
                    , 'Accept' : 'application/json, text/plain, */*'
                })
                sut.map({ noCache : true })
                httpSupport.flushAndCheckExpectations()
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
                element : 'shoji:entity'
                , body : {
                    name : 'new resource'
                }
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

    context('When posting to a shoji object', function() {
        var sut
            , newResource
            , transformedResource
            ;

        context('given the payload doesnt contain an element and body parts', function() {

            beforeEach(function() {
                sut = Shoji(catalogFixture.self)
                newResource = {
                    name : 'new resource'
                }

                transformedResource = {
                    element : 'shoji:entity'
                    , body : {
                        name : 'new resource'
                    }
                }
            })

            it('should enclose the data sent in a body element and add the element attribute', function() {
                httpSupport.expectPOST(catalogFixture.self, transformedResource, {
                    Location : '/variables/self'
                })
                sut.save({
                    data : newResource
                })
                httpSupport.flushAndCheckExpectations()
            })
        })
    })

    context('Given a shoji object', function() {
        var sut
            , accumulator
            ;

        beforeEach(function() {
            sut = Shoji(entityLargeFixture.self)
            accumulator = {}
        })

        it('should support the reduce operation', function() {
            sut.reduce(accumulator, [
                function(accumulator, current) {
                    expect(current).to.equal(sut)
                    accumulator.first = { data : 1}
                    return accumulator.first
                }
                , function(accumulator, current) {
                    expect(current).to.equal(accumulator.first)
                    accumulator.second = { data : 2 }
                    return accumulator.second
                }
                , function(accumulator, current) {
                    expect(current).to.equal(accumulator.second)
                    accumulator.third = { data : 3 }
                    return accumulator.third
                }
            ])

            inject(function($rootScope) { $rootScope.$digest() })
        })
    })

    context('When updating a shoji object', function() {
        var sut
            , data
            ;

        beforeEach(function() {
            sut = Shoji(entityFixture.self)
            data = { newField : 'new field' }
        })

        it('should send a put request to the shoji object and refresh the shoji object', function() {
            httpSupport.expectPUT(entityFixture.self, data)
            httpSupport.expectGETFixture('entity-fixture')

            sut.update({
                data : data
            })
            httpSupport.flushAndCheckExpectations()
        })
    })

    context('When patching a shoji object', function() {
        var sut
            , data
            ;

        beforeEach(function() {
            sut = Shoji(catalogFixture.self)
            data = { newField : 'new field' }
        })

        it('should send a patch request to the shoji object and refresh', function() {
            httpSupport.expectPATCH(catalogFixture.self, data)
            httpSupport.expectGETFixture('catalog-fixture')

            sut.patch({
                data : data
            })
            httpSupport.flushAndCheckExpectations()
        })
    })

    context('When deleting a shoji object', function() {
        var sut
            , data
            ;

        beforeEach(function() {
            sut = Shoji(entityFixture.self)
            data = { newField : 'new field' }
        })

        it('should send a patch request to the shoji object and refresh', function() {
            httpSupport.expectDELETE(entityFixture.self, data)

            sut.delete({
                data : data
            }).then(function(o) {
                expect(o.deleted).to.be.true
            })
            httpSupport.flushAndCheckExpectations()
        })
    })

    it('should support a shoji:view objects', function() {
        var sut = Shoji(viewFixture.self)
        httpSupport.expectGETFixture('view-fixture')
        sut.map().then(function(view) {
            expect(view.value).to.deep.equal(viewFixture.value)
        })
        httpSupport.flushAndCheckExpectations()
    })

    it('should support a shoji:order objects', function() {
        var sut = Shoji(orderFixture.self)
        httpSupport.expectGETFixture('order-fixture')
        sut.map().then(function(view) {
            expect(view.graph).to.deep.equal(orderFixture.graph)
        })
        httpSupport.flushAndCheckExpectations()
    })
})