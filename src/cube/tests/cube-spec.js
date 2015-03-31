'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , fixtures = require('./fixtures')
    , ndarray = require('ndarray')
    , ops = require('ndarray-ops')
    , show = require('ndarray-show')
    , zeros = require('zeros')
    , unpack = require('ndarray-unpack')
    ;

describe('cube', function(){
    function buildModule() {
        var mod = mainMod()
            ;
        mod.factory('iResourceVariable', function($q) {
            return function(resourceThis){
                var result = $q.when({id: resourceThis.variableId})
                return result
            }
        })
        angular.mock.module(mod.name)
    }

    function createDeps() {
        inject(function($rootScope) {
            scope = $rootScope.$new()
        })
    }
    var sut
        ,scope
    ;
    beforeEach(buildModule)
    beforeEach(createDeps)

    describe('given a cube result', function(){
        beforeEach(function(){
            inject(function(cube){
                cube.fromCrCube(fixtures.categoricalCount.value).then(function(it){
                    sut = it
                })
            })
            scope.$digest()
        })
        it('should read the data into an array of the right shape', function(){
            sut.count.cube.shape.slice().should.eql([2,6])
            sut.ravelLabels().length.should.equal(12)
        })
        it('views with `pick` should work with ndarray-ops', function(){
            ops.sum(sut.count.cube.pick(0)).should.equal(1755)
            ops.sum(sut.count.cube.pick(1)).should.equal(2771)
            ops.sum(sut.count.cube).should.equal(4526)
        })
        it('2d cell percentaging with ops should be correct and not change the cube', function(){
            var result = zeros(sut.count.cube.shape.slice())
            ops.divs(result, sut.count.cube, ops.sum(sut.count.cube))
            //console.log(show(sut.cube))
            ops.mulseq(result, 100)
            ops.sum(result).should.eql(100)
            sut.count.cube.get(0,0).should.equal(601)
        })
        it('marginal totals should exist', function(){
            var result0 = sut.margins['0']
            result0.data.should.eql([1755, 2771])
            var result1 = sut.margins['1']
            result1.data.should.eql([933, 585, 918, 792, 584, 714])
        })
        it('should divide by margins', function(){

        })
    })

    describe('with a 3d cube', function(){
        beforeEach(function(){
            inject(function(cube){
                cube.fromCrCube(fixtures.count3d.value).then(function(it){
                    sut = it
                })
            })
            scope.$digest()
        })
        it('should have the right shape', function(){
            sut.count.cube.shape.slice().should.eql([2,6,2])
        })
    })

    describe('with a categorical array cube having "enum" dimension', function(){
        beforeEach(function(){
            inject(function(cube){
                cube.fromCrCube(fixtures.categoricalArrayCube.value).then(function(it){
                    sut = it
                })
            })
            scope.$digest()
        })
        it('should have labels from the enumeration', function(){
            var expected = [
                ['A', 'B', 'C']
                ,['0.0', '1.0']
            ]
            sut.labels.should.eql(expected)
        })
        it('should be in the right shape', function(){
            sut.count.cube.shape.slice().should.eql([3,2])
        })
    })

    describe('when an index is missing', function(){
        beforeEach(function(){
            inject(function(cube){
                cube.fromCrCube(fixtures.arrayWithMissing.value).then(function(it){
                    sut = it
                })
            })
            scope.$digest()
        })
        it('should be removed', function(){
            sut.count.cube.shape.slice().should.eql([2,2])
        })
        it('should remove the right data', function(){
            unpack(sut.count.cube).should.eql([[2,1],[2,1]])
        })
        it('should show missing=1', function(){
            sut.nMissing.should.equal(1)
        })
    })

})
