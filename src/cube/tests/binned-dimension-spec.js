'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , datetimeDimensionFixture = require('./datetime-dimension')
    , numericDimensionFixture = require('./numeric-enum-dimension')
    ;

describe('BinnedDimension', function() {
    var BinnedDimension
        , sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(_BinnedDimension_) {
            BinnedDimension = _BinnedDimension_
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('given a datetime binned dimension', function() {
        describe('when getting labels', function() {
            beforeEach(function() {
                sut = new BinnedDimension(datetimeDimensionFixture)
            })

            it('should return an array of date bins', function() {
                sut.labels.should.contain('2009-05', '2009-06', '2009-07')
            })
        })
    })

    describe('given a numeric binned dimension', function() {
        describe('when getting labels', function() {
            beforeEach(function() {
                sut = new BinnedDimension(numericDimensionFixture)
            })

            it('should return numeric ranges concatenated with a dash', function() {
                sut.labels[0].should.deep.equal([1.0, 1.5])
                sut.labels[1].should.deep.equal([1.5, 2.0])
            })
        })
    })

    describe('when calculating length', function() {
        beforeEach(function() {
            sut = new BinnedDimension(datetimeDimensionFixture)
        })

        it('should return the number of bins', function() {
            sut.length.should.equal(44)
        })
    })
})
