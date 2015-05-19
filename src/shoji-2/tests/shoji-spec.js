'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , entityFixture = require('./entity-fixture')
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
            })
        })
    })
})