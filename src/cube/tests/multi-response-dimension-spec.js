'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , multiResponseDimensionFixture = require('./multiple-response-dimension')
    ;

describe('MultiResponseDimension', function() {
    var MultiResponseDimension
        , sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(_MultiResponseDimension_) {
            MultiResponseDimension = _MultiResponseDimension_
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('given a multi response dimension metadata', function() {

        describe('when getting labels', function() {
            beforeEach(function() {
                sut = new MultiResponseDimension(multiResponseDimensionFixture)
            })

            it('should return valid response labels', function() {
                sut.labels.should.deep.equal(['A', 'B', 'C'])
            })
        })

        describe('when getting missing values', function() {
            beforeEach(function() {
                sut = new MultiResponseDimension(multiResponseDimensionFixture)
            })

            it('should return true for any and none', function() {
                sut.missing.should.deep.equal([false, false, false, true, true, true])
            })
        })
    })
})
