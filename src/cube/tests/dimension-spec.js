'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , catDimensionFixture = require('./cat-dimension')
    , numericEnumDimensionFixture = require('./numeric-enum-dimension')
    , multiResponseDimensionFixture = require('./multiple-response-dimension')
    , catArrayDimensionFixture = require('./cat-array-dimension')
    ;

describe('dimension', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        main.factory('CategoricalDimension', function() {
            return function CategoricalDimension() {}
        })

        main.factory('BinnedDimension', function() {
            return function BinnedDimension() {}
        })

        main.factory('CompositeDimension', function() {
            return function CompositeDimension() {}
        })

        main.factory('MultiResponseDimension', function() {
            return function MultiResponseDimension() {}
        })

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(dimension) {
            sut = dimension
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    var dimension
        ;

    describe('when creating', function() {

        describe('given a categorical dimension metadata', function() {
            beforeEach(function() {
                dimension = sut.fromData(catDimensionFixture)
            })

            it('should return an instance of CategoricalDimension', function() {
                dimension.constructor.name.should.equal('CategoricalDimension')
            })
        })

        describe('given a binned numeric dimension metadata', function() {
            beforeEach(function() {
                dimension = sut.fromData(numericEnumDimensionFixture)
            })

            it('should return an instance of BinnedDimension', function() {
                dimension.constructor.name.should.equal('BinnedDimension')
            })
        })

        describe('given a multi response dimension metadata', function() {
            beforeEach(function() {
                dimension = sut.fromData(multiResponseDimensionFixture)
            })

            it('should return an instance of MultiResponseDimension', function() {
                dimension.constructor.name.should.equal('MultiResponseDimension')
            })
        })

        describe('given a categorical array dimension metadata', function() {
            beforeEach(function() {
                dimension = sut.fromData(catArrayDimensionFixture)
            })

            it('should return an instance CompositeDimension', function() {
                dimension.constructor.name.should.equal('CompositeDimension')
            })
        })

        describe('given an aggregate', function() {
            beforeEach(function() {
                dimension = sut.aggregateDimension('mean')
            })

            it('should return an instance of aggregate dimension', function() {
                dimension.constructor.name.should.equal('AggregateDimension')
            })
        })
    })
})
