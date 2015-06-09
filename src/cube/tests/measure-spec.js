'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , cube3Dimensions = require('./cube-3-dimensions')
    ;

describe('measure', function() {
    var sut
        , ops
        , dimension
        ;

    function buildModule() {
        var main = mainMod()
            ;


        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(measure, _dimension_, ndarrayOps) {
            sut = measure
            dimension = _dimension_
            ops = ndarrayOps
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    context('when slicing', function() {
        var slices
            , measure
            ;

        beforeEach(function() {
            var dimensions = cube3Dimensions.value.result.dimensions.map(function(d) {
                    return dimension.fromData(d)
                })
                ;

            var validShape = dimensions.map(function(d) {
                return d.validLength
            })

            var shape = dimensions.map(function(d) {
                return d.length
            })

            measure = sut.fromData({
                type : 'count'
                , meta : {
                    dimensions : dimensions
                    , shape : shape
                    , validShape : validShape
                }
                , data : cube3Dimensions.value.result.measures.count.data
            })

            slices = measure.slices
        })

        it('should return a list of measures with length equals to the sliced dimension', function() {
            expect(slices.length).to.equal(measure.dimensions[0].length)
        })

        it('should create measure objects with data that corresponds to each slice in the cube', function() {
            slices.forEach(function(slice, index) {
                ops.equals(slice.rawData, measure.rawData.lo(index).hi(1).pick(0))
                ops.equals(slice.cube, measure.cube.lo(index).hi(1).pick(0))
            })
        })
    })
})

