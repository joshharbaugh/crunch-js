'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , shojiMod = require('../../shoji')
    , fixtures = {
        dataset: require('./dataset')
        , joins: require('./joins')
        , emptyJoins : require('./empty-joins')
        , variables: require('./variables')
        , subordinateVariables : require('./subordinate-variables')
        , hierarchicalUngrouped : require('./hierarchical-ungrouped')
        , privateVariables : require('./private-variables')
    }
    ;

describe('iFetchHierarchicalVariables', function() {
    var sut
        , headers = {
            ALLOW: 'GET'
        }
        ;

    function buildModule() {
        var main = mainMod()
            , shoji = shojiMod('shoji.test')
            ;

        main.factory('currentDataset',function($q, Shoji){
            return {
                fetch : function(q){
                    var res = Shoji(fixtures.dataset.self).parse(fixtures.dataset)
                    return $q.when(res)
                }
            }
        })

        angular.mock.module(main.name, shoji.name)
    }

    function buildSut() {
        angular.mock.inject(function(iFetchHierarchicalVariables) {
            sut = iFetchHierarchicalVariables
        })
    }

    function flush() {
        angular.mock.inject(function($rootScope, $httpBackend) {
            $rootScope.$digest()
            $httpBackend.flush()
            $httpBackend.verifyNoOutstandingExpectation()
            $httpBackend.verifyNoOutstandingRequest()
        })
    }

    function GET(fixture, url){
        if (url === undefined) {
            url = fixture.self
        }
        angular.mock.inject(function($rootScope, $httpBackend) {
            $httpBackend.expectGET(url)
                .respond(200, fixture, headers)
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when fetching hierarchical variables', function() {

        describe('given a dataset with 1 join', function() {
            var hierarchicalVariables
                ;

            beforeEach(function setupRequestExpectations() {
                GET(fixtures.variables, fixtures.variables.self + '?nosubvars=1&relative=on')
                GET(fixtures.joins)
                // This GET fetches the joined dataset subvariables
                GET(fixtures.subordinateVariables + '?nosubvars=1&relative=on')
                GET(fixtures.hierarchicalUngrouped, fixtures.hierarchicalUngrouped.self + '?relative=on')
            })

            beforeEach(function(){
                sut({ datasetId: '123' }).then(function(_hierarchicalVariables){
                    hierarchicalVariables = _hierarchicalVariables
                })
                flush()
            })

            it('should return a HierarchicalVariables object', function() {
                inject(function(HierarchicalVariables) {
                    expect(hierarchicalVariables instanceof HierarchicalVariables).to.be.true
                })
            })

            it('should fetch 2 variable catalogs', function() {
                expect(hierarchicalVariables.catalogs.length).to.equal(2)
            })

            it('should fetch the hierarchical order', function() {
                expect(hierarchicalVariables.order).to.be.ok
            })
        })

        describe('given the includePrivateVariables option', function() {
            var hierarchicalVariables
                ;

            beforeEach(function setupRequestExpectations() {
                GET(fixtures.variables, fixtures.variables.self + '?nosubvars=1&relative=on')
                GET(fixtures.emptyJoins)
                GET(fixtures.hierarchicalUngrouped, fixtures.hierarchicalUngrouped.self + '?relative=on')
                GET(fixtures.privateVariables, fixtures.privateVariables.self)
            })

            beforeEach(function(){
                sut({ datasetId: '123', includePrivateVariables : true }).then(function(_hierarchicalVariables){
                    hierarchicalVariables = _hierarchicalVariables
                    hierarchicalVariables.exposePrivateVariables()

                })
                flush()
            })

            it('should add private variables catalog to the hierarchical order', function() {
                expect(hierarchicalVariables.at(0).name).to.equal('My Variables')
                expect(hierarchicalVariables.byId('variable1')).to.be.ok
            })

            it('should sort private variables by name', function() {
                //see private-variables.json
                expect(hierarchicalVariables.byName('My Variables').items[0].name).to.equal('Children')
            })

            it('should add private flag to hierarchical variables', function() {
                expect(hierarchicalVariables.at(0).private).to.be.true
                expect(hierarchicalVariables.byId('variable1').private).to.be.true
            })
        })
    })
})
