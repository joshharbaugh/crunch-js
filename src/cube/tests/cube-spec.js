'use strict'

require('angular-mocks')

var  mainMod = require('../index')
    , fixtures = require('./fixtures')
    , cube3dFixture = require('./cube-3-dimensions')
    , ops = require('ndarray-ops')
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

    context('given a cube result', function(){
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
    })

    context('with a 3d cube', function(){
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

    context('with a categorical array cube having "enum" dimension', function(){
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

    context('when an index is missing', function(){
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

    context('when getting a slice at a given index', function() {
        var sut
            ;

        beforeEach(function() {
            inject(function(cube) {
                cube.fromCrCube(cube3dFixture.value).then(function(it) {
                    sut = it
                })
            })

            scope.$digest()
        })

        it('should return a cube object whose measures are slices of the original cube measures', function() {
            var slice = sut.getSliceAtIndex(0)
                ;

            expect(slice.count).to.be.ok
            expect(slice.mean).to.be.ok
            expect(ops.equals(slice.count.cube, sut.count.cube.lo(0).hi(1).pick(0))).to.be.true
            expect(ops.equals(slice.mean.cube, sut.mean.cube.lo(0).hi(1).pick(0))).to.be.true
        })
    })

})
