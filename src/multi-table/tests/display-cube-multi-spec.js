'use strict'

require('angular-mocks')

var  mainMod = require('../index')
    , cubeMod = require('../../cube')
    , multifixture = require('../../cube/tests/basic-categorical-multi')
    , ops = require('ndarray-ops')
    , unpack = require('ndarray-unpack')
    ;

describe('cube', function(){
    function buildModule() {
        var mod = mainMod()
            ,cube = cubeMod('cube.test')
            ;
        mod.factory('iResourceVariable', function($q) {
            return function(resourceThis){
                var result = $q.when({id: resourceThis.variableId})
                return result
            }
        })
        angular.mock.module(mod.name, cube.name)
    }
    function createDeps() {
        inject(function($rootScope) {
            scope = $rootScope.$new()
        })
    }
    function buildSut() {
        angular.mock.inject(function(MultiTable) {
            Sut = MultiTable
        })
    }
    function flush() {
        angular.mock.inject(function($rootScope) {
            $rootScope.$digest()
        })
    }
    var Sut
        ,sut
        ,scope
        ;
    beforeEach(buildModule)
    beforeEach(buildSut)
    beforeEach(createDeps)

    context('with a array cube of one cat. by two different cat.', function(){
        beforeEach(function(){
            angular.mock.inject(function(cube){
                var columns = ['/api/datasets/123/variables/abc/']
                // columns should be like a VariableList

                cube.fromMultiCube(multifixture.value).then(function(it){
                    sut = Sut.create({
                    columns: columns,
                    result: it
                    })
                })
                flush()
            })
            sut.then(function(it){
                scope.xtabs = it.display()
            })
            flush()
        })
        it('should display things', function(){
            console.log(scope.xtabs)
        })
    })


})
