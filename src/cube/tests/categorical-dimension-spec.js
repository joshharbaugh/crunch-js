'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , catDimensionFixture = require('./cat-dimension')
    ;

describe('CategoricalDimension', function() {
    var CategoricalDimension
        , sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(_CategoricalDimension_) {
            CategoricalDimension = _CategoricalDimension_
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when getting valid labels', function() {
        beforeEach(function() {
            sut = new CategoricalDimension(catDimensionFixture)
        })

        it('should return an array of category names', function() {
            sut.labels.should.deep.equal(['red', 'green', 'blue', '4', '9'])
        })
    })

    describe('when getting missing labels', function() {
        beforeEach(function() {
            sut = new CategoricalDimension(catDimensionFixture)
        })

        it('should return an array of missing category names', function() {
            sut.missingLabels.should.deep.equal(['8', 'No Data'])
        })
    })

    describe('when calculating length', function() {
        beforeEach(function() {
            sut = new CategoricalDimension(catDimensionFixture)
        })

        it('should return the number of categories', function() {
            sut.length.should.equal(['red', 'green', 'blue', '4', '8', '9', 'No Data'].length)
        })
    })
})
