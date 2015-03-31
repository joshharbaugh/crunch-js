'use strict'

var mainModule = require('../index')
    ,shojiModule = require('../../shoji/index')
    ,mocks = require('angular-mocks')
    ,batchFixtures = require('./i-resource-batch-fixtures')
    ;

describe('IResourceBatch', function() {
    var sut
        ;

    function buildModule() {
        var mod = mainModule('resource.test')
            ,shoji
            ;

        shoji = shojiModule('shoji.test')

        angular.mock.module(mod.name, shoji.name)
    }

    function expectBatchRequest() {
        angular.mock.inject(function($httpBackend) {
            $httpBackend.expectGET(batchFixtures.batchURL)
            .respond(201, batchFixtures.batchResponse)
        })
    }

    function buildSut() {
        angular.mock.inject(function(iResourceBatch) {
            sut = iResourceBatch
        })
    }

    function flush() {
        angular.mock.inject(function($httpBackend) {
            $httpBackend.flush()
        })
    }

    describe('when getting a batch', function() {

        beforeEach(buildModule)
        beforeEach(buildSut)

        describe('given a batch id', function() {
            var batchId
                ;

            beforeEach(function() {
                batchId = batchFixtures.batchURL
                expectBatchRequest()
            })

            it('should return the batch resource', function() {
                sut({ batchId : batchId }).then(function(batch) {
                    batch.self.should.equal(batchFixtures.batchURL)
                })

                flush()
            })
        })
    })
})
