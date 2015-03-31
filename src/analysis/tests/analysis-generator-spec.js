'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    ;

describe('analysisGenerator', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(analysisGenerator) {
            sut = analysisGenerator
        })
    }

    describe('when setting next generator in the chain', function() {
        beforeEach(buildModule)
        beforeEach(buildSut)

        describe('given the object doesn\'t conform with the generator interface', function() {

            it('should throw an error', function() {
                var triggered = false
                    ;

                try {
                    sut.next = 'random generator'
                } catch(e) {
                    triggered = true
                    e.message.should.be.equal('generator doesn\'t conform with interface')
                }

                expect(triggered).to.be.truthy
            })
        })
    })

    describe('when generating', function() {
        beforeEach(buildModule)
        beforeEach(buildSut)

        describe('given no valid generator', function() {

            it('should throw a request could not be handled error', function() {
                var triggered
                    ;

                try {
                    sut.generate()
                } catch(e) {
                    triggered = true
                    e.message.should.be.equal('request could not be handled')
                }

                expect(triggered).to.be.truthy
            })
        })

    })
})
