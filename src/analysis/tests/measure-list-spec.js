'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , mockHierarchicalVariables = require('../../test-support/mock-hierarchical-variables')
    , varsFixture = require('../../hierarchical-variables/tests/variables')
    , orderFixture = require('../../hierarchical-variables/tests/hierarchical-grouped')
    ;

describe('MeasureList', function() {
    var MeasureList
        , fakeVariable
        , datasetId = '/datasets/123'
        ;

    function buildModule() {
        var main = mainMod()
            ;

        main.factory('cachedHierarchicalVariables', function($q) {
            var cached = { }
                ;

            cached.current = mockHierarchicalVariables
            .getHierarchicalVariablesObj(undefined, varsFixture, orderFixture)

            return cached
        })

        mockHierarchicalVariables.registerModule()

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(_MeasureList_) {
            MeasureList = _MeasureList_
        })
    }

    function flush() {
        angular.mock.inject(function($rootScope) {
            $rootScope.$digest()
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when adding a mean measure', function() {
        var sut
            ;

        beforeEach(function() {
            sut = new MeasureList(datasetId)
            sut.add('mean', '/economytrend')
            flush()
        })

        it('should fetch measure variable', function() {
            expect(sut.getMeasureVariable('mean', 0)).to.have.property('self', '/api/datasets/123/variables/economytrend/')
        })
    })

    describe('when serializing', function() {

        describe('given a measure list with a mean measure', function() {
            var expectations
                , sut
                ;

            beforeEach(function() {
                expectations =  {
                    "mean": {"function": "cube_mean", args: [{variable: '/api/datasets/123/variables/economytrend/' }] },
                    "stddev": {"function": "cube_stddev", args: [{ variable: '/api/datasets/123/variables/economytrend/' }] }
                }
            })

            beforeEach(function() {
                sut = new MeasureList(datasetId)
                sut.add('mean', '/economytrend')
                flush()
            })

            it('should return a cube query format of requesting a mean and stddev measures', function() {
                sut.toJSON().should.be.deep.equal(expectations)
            })
        })

        describe('given an empty measure list', function() {
            var sut
                ;

            beforeEach(function() {
                sut = new MeasureList(datasetId)
            })

            it('should return a default count measure', function() {
                sut.toJSON().should.be.deep.equal({ count : { 'function' : 'cube_count', args : [] }})
            })
        })
    })
})
