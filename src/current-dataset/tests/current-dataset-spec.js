'use strict'

var mocks = require('angular-mocks')
    ,mainMod = require('../index')
    ;

describe('CurrentDataset', function() {
    var sut
        ,dataset
        ;

    function buildModule() {
        var mod = mainMod()
            ;

        dataset = {}

        mod.factory('iResourceDataset', function($q) {
            return function execute(params) {
                execute.calls = execute.calls || 0
                execute.calls++
                execute.parameters = params
                return $q.when(dataset)

            }
        })

        mod.factory('shojiDataStrategy', function() {
            return {}
        })

        angular.module('ui.router', [])
        angular.mock.module(mod.name)
    }

    function buildSut() {
        angular.mock.inject(function(currentDataset) {
            sut = currentDataset
        })
    }

    function flush() {
        angular.mock.inject(function($rootScope) {
            $rootScope.$digest()
        })
    }

    describe('when fetching a dataset', function() {

        describe('given it s the first time fetching', function() {
            var currentDatasetId
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                currentDatasetId = '/datasets/123'
                sut.set(currentDatasetId)
                sut.fetch()
            })

            it('should request the dataset from the server', function() {
                angular.mock.inject(function(iResourceDataset) {
                    iResourceDataset.calls.should.equal(1)
                })
            })

            it('should request with the current dataset id', function() {
                angular.mock.inject(function(iResourceDataset) {
                    iResourceDataset.parameters.datasetId.should.equal(currentDatasetId)
                })
            })
        })

        describe('given there is a pending request', function() {
            var currentDatasetId
                ,promise1
                ,promise2
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                currentDatasetId = '/datasets/123'
                sut.set(currentDatasetId)
                promise1 = sut.fetch()
                promise2 = sut.fetch()
            })

            it('should use the same promise as the pending request', function() {
                promise1.should.be.equal(promise2)
            })
        })

        describe('given the dataset is already fetched', function() {
            var currentDatasetId
                ,promise1
                ,promise2
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                currentDatasetId = '/datasets/123'
                sut.set(currentDatasetId)
                promise1 = sut.fetch()
                flush()
                promise2 = sut.fetch()
            })

            it('should only fetch the dataset once', function() {
                angular.mock.inject(function(iResourceDataset) {
                    iResourceDataset.calls.should.be.equal(1)
                })
            })

            it('should not use a pending request', function() {
                promise1.should.not.be.equal(promise2)
            })
        })

        describe('given a new dataset is set', function() {
            var datasetId1 = '/datasets/123'
                ,datasetId2 = '/datasets/124'
                ,promise1
                ,promise2
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut.set(datasetId1)
                promise1 = sut.fetch()
                sut.set(datasetId2)
                promise2 = sut.fetch()
            })

            it('clean previous requests and make a new one', function() {
                angular.mock.inject(function(iResourceDataset) {
                    iResourceDataset.calls.should.be.equal(2)
                })
            })
        })
    })

    describe('when cleaning existing data', function() {
        beforeEach(buildModule)
        beforeEach(buildSut)

        describe('given the dataset is fetched', function() {
            var datasetId = '/datasets/123'
                ;

            beforeEach(function() {
                sut.set(datasetId)
                sut.fetch()
                flush()
                sut.clean()
                sut.fetch()
            })

            it('should request the dataset again', function() {
                angular.mock.inject(function(iResourceDataset) {
                    iResourceDataset.calls.should.be.equal(2)
                })
            })
        })
    })

})
