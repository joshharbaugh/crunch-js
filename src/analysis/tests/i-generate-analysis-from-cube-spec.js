'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , cubeMod = require('../../cube/index')
    , fixtures = require('./shoji-fixtures')
    ;
fixtures.dataset = require('../../test-support/fixtures/dataset-entity')

describe('iGenerateAnalysisFromCube', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod('main.test')
            ,cubeTest = cubeMod('cube.test')
            ;

        cubeTest.factory('iResourceVariable', function($q){
            return function(varb){
                return $q.when(varb)
            }
        })
        cubeTest.factory('iResourceDataset', function($q){
            return function(params){
                return $q.when(params)
            }
        })
        cubeTest.factory('iFetchCubes', function($q){
            return function(){
                return $q.when(fixtures.cube2x2.value)
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
        angular.mock.inject(function(iGenerateAnalysisFromCube, $rootScope) {
            $rootScope.hierarchicalVariablesList = {
                variable : function() {
                    return { fullName : 'full name' }
                }
            }
            sut = iGenerateAnalysisFromCube
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
                        , variables : {
                            'valueOf': function(){ return [
                                {self: '/variables/123', type: 'categorical'}
                                , {self: '/variables/456', type: 'categorical'}
                            ]}
                        }
                        , measures: {
                            'valueOf': function() {}
                        }
                    })

                    flush()
                })
            })
        })
    })
})
