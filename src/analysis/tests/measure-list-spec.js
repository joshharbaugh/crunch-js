'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , mockHierarchicalVariables = require('../../test-support/mock-hierarchical-variables')
    , varsFixture = require('../../hierarchical-variables/tests/variables')
    , orderFixture = require('../../hierarchical-variables/tests/hierarchical-grouped')
    , _ = require('lodash')
    ;

describe('MeasureList', function() {
    var MeasureList
        , hv
        , datasetId = '/datasets/123'
        , subvariableFixture = {
            element : 'shoji:entity'
            , self : '/var/456'
            , body : {
                name : 'LeadershipObama'
            }
        }
        ;

    function buildModule() {
        var main = mainMod()
            ;

        main.factory('cachedHierarchicalVariables', function() {
            var cached = { }
                ;
            hv = mockHierarchicalVariables
            .getHierarchicalVariablesObj(undefined, _.cloneDeep(varsFixture), orderFixture)

            cached.current = hv

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
    function expectGET(url, content) {
        inject(function($httpBackend) {
            $httpBackend.expectGET(url).respond(200, content)
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
    describe('given a subvariable', function() {
        var sut
            ;

        beforeEach(function() {
            var subvar = hv.byId('leadershipobama/')
                , matrix = hv.byId('leadershipMatrix')
                ;

            sut = new MeasureList(datasetId)


            inject(function($q, Shoji) {
                matrix.getSubvariables = function () {
                    return $q.when({})
                }

                matrix.subvariableById = function () {
                    return {
                        name:  'LeadershipObama'
                        , map: function () {
                            return Shoji(subvar.self).map()
                        }
                    }
                }
            })

            expectGET(subvar.self, subvariableFixture)
            sut.add('mean', 'leadershipobama/')
            flush()
        })

        it('should fetch the subvariable metadata and add it to the list', function() {
            var measureVar = sut.getMeasureVariable('mean', 0)
            expect(measureVar).to.have.property('name', 'LeadershipObama')
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
                    "count": {"function": "cube_count", args: [] }
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
