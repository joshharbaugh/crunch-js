'use strict'

var mocks = require('angular-mocks'),
    mainMod = require('../index'),
    age4Dimension = require('./age4-dimension'),
    genderDimension = require('./gender-dimension')
    ;
describe('dimension', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        // main.factory('CategoricalDimension', function() {
        //     return function CategoricalDimension() {}
        // })
        //
        // main.factory('BinnedDimension', function() {
        //     return function BinnedDimension() {}
        // })
        //
        // main.factory('CompositeDimension', function() {
        //     return function CompositeDimension() {}
        // })
        //
        // main.factory('MultiResponseDimension', function() {
        //     return function MultiResponseDimension() {}
        // })

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

    describe('applying analysis transforms', function() {

        describe('given a categorical dimension metadata', function() {
            var makeUnmissing = [{"id": 2},{"id": 1}, // otherwise 8 would come first
                {
                    "id": 8,
                    "name": "-Skipped-",
                    "missing": false,
                    "hide": false
                }]
            beforeEach(function() {
                dimension = sut.fromData(genderDimension).applyTransform(makeUnmissing)
            })

            it('should return an instance of CategoricalDimension', function() {
                dimension.constructor.name.should.equal('CategoricalDimension')
            })
            it('should have valid subscripts [0,1,2]', function(){
                dimension.validSubscripts.should.eql([0,1,2])
            })
            it('should have missing extents [3,4]', function(){
                dimension.missingSubscripts.should.eql([3,4])
            })
            it('should have the transformed names as labels', function(){
                dimension.labels.should.eql(['Female', 'Male', '-Skipped-'])
            })
            it('should advertise what subscripts should be applied to the data', function(){
                dimension.targetPermutation.should.eql([1,0,2,3,4])
            })
            it('should have hide properties', function(){
                dimension.extents.map(function(each){
                    each.hasOwnProperty('hide').should.be.ok
                })
            })
            it('should expose subscripts to show', function(){
                dimension.shownSubscripts.should.eql([0,1,2])
            })
        })
    })
})
