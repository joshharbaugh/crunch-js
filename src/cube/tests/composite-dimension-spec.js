'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , catArrayDimensionFixture = require('./cat-array-dimension')
    ;

xdescribe('CompositeDimension', function() {
    var CompositeDimension
        , sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(_CompositeDimension_) {
            CompositeDimension = _CompositeDimension_
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when getting labels', function() {

        describe('given a categorical array metadata', function() {
            beforeEach(function() {
                sut = new CompositeDimension(catArrayDimensionFixture)
            })

            it('should return valid response labels', function() {
                sut.labels.should.deep.equal(['Y', 'Z'])
            })
        })
    })
})
