'use strict'

require('angular-mocks')

var  mainMod = require('../index')
    , fixtures = require('./fixtures')
    , multifixture = require('./basic-categorical-multi')
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
        ,subresult
    ;
    beforeEach(buildModule)
    beforeEach(createDeps)

    context('with a array cube of one cat. by two different cat.', function(){
        beforeEach(function(){
            // Is there a way to just unwrap _all_ the promises here?
        })
        it('first cube should have the right shape', function(){
            inject(function(cube){
                cube.fromMultiCube(multifixture.value).then(function(it){
                    it[0].then(function(subcube){
                        sut = subcube
                    })
                })
            })
            scope.$digest()
            sut.count.cube.shape.slice().should.eql([5,2])
        })
        it('second cube should have the right shape', function(){
            inject(function(cube){
                cube.fromMultiCube(multifixture.value).then(function(it){
                    it[1].then(function(subcube){
                        sut = subcube
                    })
                })
            })
            scope.$digest()
            sut.count.cube.shape.slice().should.eql([5,4])
        })
    })


})
