'use strict';
var mainModule = require('../index')
    ,shojiModule = require('../../shoji/index')
    ,mocks = require('angular-mocks')
    ,fixtures = require('./i-resource-batches-fixtures')
    ;

describe('IResourceBatches', function() {
    var sut
        ;

    function buildModule() {
        var mod = mainModule('resource.test')
            ,shoji
            ;

        shoji = shojiModule('shoji.test')

        mockIResourceDataset(mod)

        angular.mock.module(mod.name, shoji.name)
    }

    function mockIResourceDataset(main) {
        main.factory('iResourceDataset', function(Shoji, $q) {
            return function(q) {
                var res = Shoji(fixtures.datasetURL)
                .parse(fixtures.datasetResponse)
                return $q.when(res)
            }
        })
    }

    function expectBatchesRequest() {
        angular.mock.inject(function($httpBackend) {
            $httpBackend.expectGET(fixtures.datasetBatchesURL)
            .respond(201, fixtures.batchesResponse)
        })
    }

    function buildSut() {
        angular.mock.inject(function(iResourceBatches) {
            sut = iResourceBatches
        })
    }

    function flush() {
        angular.mock.inject(function($httpBackend) {
            $httpBackend.flush()
        })
    }

    describe('when getting batches', function() {

        beforeEach(buildModule)
        beforeEach(buildSut)

        describe('given a dataset id', function() {
            var datasetId
                ;

            beforeEach(function() {
                datasetId = fixtures.datasetURL
                expectBatchesRequest()
            })

            it('should return the batches resource', function() {
                sut({ datasetId : datasetId }).then(function(batches) {
                    batches.self.should.equal(fixtures.datasetBatchesURL)
                })

                flush()
            })
        })
    })
})
