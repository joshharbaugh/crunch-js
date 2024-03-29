'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , cubeMod = require('../../cube/index')
    , multifixture = require('./basic-categorical-multi')
    , arrayresult = require('../../cube/tests/cube-3-dimensions')
    ;

describe('iGenerateMultitableFromCube', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod('main.test')
            , cubeTest = cubeMod('cube.test')
            ;

        cubeTest.factory('currentDataset', function($q){
            return {fetch: function(){
                return $q.when(params)
            }}
        })
        cubeTest.factory('iResourceVariable', function($q){
            return function(params){
                return $q.when(params)
            }
        })
        cubeTest.factory('iFetchCubes', function($q){
            return function(command){
                if(command && command.query.dimensions){
                    return $q.when(arrayresult.value)
                }
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
                        , columnQueries : [
                            {variable: '/api/datasets/123/variables/gender/'}
                            , {variable: '/api/datasets/123/variables/age/'}
                        ]
                        , rowVariable: {
                             self: '/api/datasets/123/variables/row/', type: 'categorical'
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
                        , columnQueries : [
                            {variable: '/api/datasets/123/variables/gender/'}
                            , {variable: '/api/datasets/123/variables/age/'}
                        ]
                        , rowVariable: {
                             self: '/api/datasets/123/variables/row/', type: 'categorical_array'
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
