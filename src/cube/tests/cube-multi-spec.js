'use strict'

require('angular-mocks')

var  mainMod = require('../index')
    , fixtures = require('./fixtures')
    , multifixture = require('./basic-categorical-multi')
    , ops = require('ndarray-ops')
    , unpack = require('ndarray-unpack')
    , analysisMod = require('../../analysis')
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
        analysisMod('analysis.test')
        angular.mock.module(mod.name, 'analysis.test')
    }

    function createDeps() {
        inject(function($rootScope) {
            scope = $rootScope.$new()
        })
    }
    var sut
        ,scope
        ,subresult
    ;
    beforeEach(buildModule)
    beforeEach(createDeps)

    context('with a array cube of one cat. by two different cat.', function(){
        beforeEach(function(){
            inject(function($q, $rootScope, cube){
                cube.fromMultiCube(multifixture.value).then(function(them){
                    sut = them
                })
            })
            scope.$digest()
        })
        it('first cube should have the right shape', function(){
            sut[0].count.cube.shape.slice().should.eql([5,2])
        })
        it('second cube should have the right shape', function(){
            sut[1].count.cube.shape.slice().should.eql([5,4])
        })
    })
    context('basic multi-table result with dimension transformations', function(){
        beforeEach(function(){
            inject(function($q, $rootScope, cube){
                cube.fromMultiCube(multifixture.value)
                .applyMultiTransforms(1, [
                    {
                        "categories": [
                            {"id": 2},{"id": 1}, // otherwise 8 would come first
                            {
                                "id": 8,
                                "name": "-Skipped-",
                                "missing": false,
                                "hide": false
                            }
                        ]
                    }
                ])
                .then(function(them){
                    sut = them
                })
            })
            scope.$digest()
        })
        it('should have reordered the elements in the data', function(){

        })
        it('should have the right labels', function(){

        })
    })


})
