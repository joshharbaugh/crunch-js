'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , cubeMod = require('../../cube/index')
    , multifixture = require('./basic-categorical-multi')
    ;

describe('iGenerateMultitableFromCube', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod('main.test')
            , cubeTest = cubeMod('cube.test')
            ;

        cubeTest.factory('iResourceDataset', function($q){
            return function(params){
                return $q.when(params)
            }
        })
        cubeTest.factory('iFetchCubes', function($q){
            return function(){
                return $q.when(multifixture.value)
            }
        })
        main.factory('datetimeFormatter', function(){
            return angular.noop
        })
        main.factory('svgTextUtil', function(){
            return angular.noop
        })
        main.factory('tableCellColors', function(){
            return {getScale: angular.noop}
        })

        main.factory('cachedHierarchicalVariables', function() {
            return {
                current : {
                    byId : function() {
                        return ''
                    }
                }
            }
        })

        angular.mock.module('main.test', 'cube.test')
    }

    function buildSut() {
        angular.mock.inject(function(iGenerateMultitableFromCube) {
            sut = iGenerateMultitableFromCube
        })
    }

    function flush() {
        angular.mock.inject(function($rootScope) {
            $rootScope.$digest()
        })
    }

    describe('when generating an analysis', function() {

        describe('given a list of variables', function() {
            beforeEach(buildModule)
            beforeEach(buildSut)

            it('should do cube stuff for categoricals', function(){
                inject(function(){
                    sut.execute({
                        datasetId: '/datasets/123/'
                        , multitable_variables : {
                            'valueOf': function(){ return [
                                {self: '/api/datasets/123/variables/gender/', type: 'categorical'}
                                , {self: '/api/datasets/123/variables/age/', type: 'categorical'}
                            ]}
                        }
                        , row_variable: {
                            'valueOf': function(){
                                return {self: '/api/datasets/123/variables/row/', type: 'categorical'}
                            }
                        }
                    }).then(function(result){
                        result.cube.should.be.ok
                        result.columns.should.be.ok
                    })
                    flush()
                })
            })
            it('should do an array of stuff for arrays', function(){
                inject(function(){
                    sut.execute({
                        datasetId: '/datasets/123/'
                        , multitable_variables : {
                            'valueOf': function(){ return [
                                {self: '/api/datasets/123/variables/gender/', type: 'categorical'}
                                , {self: '/api/datasets/123/variables/age/', type: 'categorical'}
                            ]}
                        }
                        , row_variable: {
                            'valueOf': function(){
                                return {self: '/api/datasets/123/variables/row/', type: 'categorical_array'}
                            }
                        }
                    }).then(function(result){
                        result.cube.should.be.ok
                        result.columns.should.be.ok
                    })
                    flush()
                })
            })
        })
    })
})
