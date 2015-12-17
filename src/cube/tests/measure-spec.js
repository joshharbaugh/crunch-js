'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , cube3Dimensions = require('./cube-3-dimensions')
    , genderDimension = require('./gender-dimension')
    , multiFixture = require('./basic-categorical-multi')
    , show = require('ndarray-show')
    , scratch = require('ndarray-scratch');

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
    context('transforming a cube dimension', function(){
        // using just one of the basic categorical multi fixture
        var measure

        beforeEach(function() {
            var dimensions = multiFixture.value[0].result.dimensions.map(function(d) {
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
                , data : multiFixture.value[0].result.measures.count.data
            })

        })
        it('should transform and store the new result', function(){
            var myTransform = {
                "categories": [
                    {"id": 2, name: "Potatoes"},
                    {"id": 1, name: "Beets"},
                    {
                        "id": 8,
                        "name": "-Skipped-",
                        "missing": false,
                        "hide": false
                    }
                ]
            }
            var myTargetDim = 1
            var ids = measure.dimensions[1].extents.map(function(e) {return e.id})
            var temp = scratch.clone(measure.rawData.pick(-1, 0))
            var firstRow = Array.prototype.slice.call(temp.data)
            temp = scratch.clone(measure.rawData.pick(-1, 1))
            var secondRow = Array.prototype.slice.call(temp.data)
            ids.should.eql([ 1, 2, 8, 9, -1 ]) // before transform
            measure.cube.shape.should.eql([5, 2])

            ////////////////////////////////////////////
            measure.transform(myTargetDim, myTransform)

            measure.dimensions[1].labels.should.eql(['Potatoes', 'Beets', '-Skipped-'])
            var ids = measure.dimensions[1].extents.map(function(e) {return e.id})
            ids.should.eql([ 2, 1, 8, 9, -1 ]) // after transform
            measure.cube.shape.should.eql([5, 3])
            temp = scratch.clone(measure.rawData.pick(-1, 0))
            var newFirstRow = Array.prototype.slice.call(temp.data)
            temp = scratch.clone(measure.rawData.pick(-1, 1))
            var newSecondRow = Array.prototype.slice.call(temp.data)

            newFirstRow.should.eql(secondRow)
            newSecondRow.should.eql(firstRow)
        })
    })
})
