'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , shojiMod = require('../../shoji')
    , cubeMod = require('../../cube')
    , fixtures = require('./shoji-fixtures')

describe('iGenerateAnalysisFromSavedAnalysis', function() {
    var sut
        ;

    function buildModule() {
        var mod = mainMod()
            , shoji = shojiMod('shoji.test')
            , cube = cubeMod('cube.test')
            ;


        mod.factory('iResourceDataset', function($q, Shoji) {
            return function() {
                return $q.when(Shoji(fixtures.dataset.self).parse(fixtures.dataset))
            }
        })

        cube.factory('iFetchCubes', function($q, Shoji){
            return function() {
                return $q.when(fixtures.cube2x2.value)
            }
        })

        angular.mock.module(mod.name, shoji.name, cube.name)
    }

    function buildSut() {
        angular.mock.inject(function(iGenerateAnalysisFromSaved) {
            sut = iGenerateAnalysisFromSaved
        })
    }

    function flush() {
        angular.mock.inject(function($httpBackend, $rootScope) {
            $rootScope.$digest()
        })
    }

    describe('when fetching an analysis', function() {

        describe('given an analysis query', function() {
            var response
                ;

            beforeEach(function() {
                buildModule()
                buildSut()
                sut.execute({
                    datasetId : '/datasets/123'
                    , analysis : fixtures.anAnalysisForDataset.body
                }).then(function(r) {
                    response = r
                })
                flush()
            })

            it('should return a cube to hand off as the Analysis', function() {
                response.cube.n.should.equal(4526)
                response.cube.dimension.should.equal(2)
                response.variables.length.should.equal(2)
            })
        })
    })

})
