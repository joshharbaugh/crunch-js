'use strict';
var mainModule = require('../index')
    ,shojiModule = require('../../shoji/index')
    ,mocks = require('angular-mocks')
    ,fixtures = require('./i-resource-variables-fixtures')
    ,IResourceVariables = require('../i-resource-variables');;
describe('IResourceVariables', function() {
    var $httpBackend
        , headers = {
    ALLOW: 'GET,POST,PUT,DELETE'
        }
        , main;;

    function GET(fixture, params) {
        $httpBackend.expectGET(fixture.self + (params ||
                                               ''))
        .respond(200, fixture, headers)
    }

    function mockServices(main) {
        main.factory('iResourceDataset', function(Shoji, $q) {
            return function(q) {
                var res = Shoji('/api/datasets/123/')
                .parse({
                    self: '/api/datasets/123/'
                    , element: 'shoji:entity'
                    , urls: {
                variables_url: fixtures
                .variables.self
                    }
                });
                return $q.when(res)
            }
        })
    }
    beforeEach(function() {
        main = mainModule('resource.test');
        mockServices(main);
        shojiModule('shoji.test');
        angular.mock.module('resource.test', 'shoji.test')
    });
    beforeEach(function() {
        inject(function(_$httpBackend_, _Shoji_) {
            $httpBackend = _$httpBackend_;
            _Shoji_.API = _Shoji_('/api/')
        })
    });
    describe('when invoked without query filter', function() {
        var result;
        beforeEach(function() {
            GET(fixtures.variables)
        });
        beforeEach(function() {
            inject(function(iResourceVariables) {
                var q = {
                    datasetId: '123'
                };
                iResourceVariables(q)
                .then(function(its) {
                    result = its
                });
                $httpBackend.flush()
            })
        });
        it('should return all variables', function() {
            result.self.should.equal(fixtures.variables
                                     .self);
                                     result.index.length.should.equal(5)
        })
    });
    describe('when invoked with query filter', function() {
        var result;
        beforeEach(function() {
            GET(fixtures.variablesOnlyMeasureDate, '?alias=measure_Date')
        });
        beforeEach(function() {
            inject(function(iResourceVariables) {
                var q = {
                    datasetId: '123'
                    , variableAlias: 'measure_Date'
                };
                iResourceVariables(q)
                .then(function(its) {
                    result = its
                });
                $httpBackend.flush()
            })
        });
        it('should return the single variables', function() {
            result.self.should.equal(fixtures.variablesOnlyMeasureDate
                                     .self);
                                     result.index.length.should.equal(1)
        })
    });
    describe('when invoked with query filter by ID', function() {
        var result;
        beforeEach(function() {
            GET(fixtures.variablesOnlyMeasureDate, '?id=abc')
        });
        beforeEach(function() {
            inject(function(iResourceVariables) {
                var q = {
                    datasetId: '123'
                    , variableId: 'abc'
                };
                iResourceVariables(q)
                .then(function(its) {
                    result = its
                });
                $httpBackend.flush()
            })
        });
        it('should return the single variables', function() {
            result.self.should.equal(fixtures.variablesOnlyMeasureDate
                                     .self);
                                     result.index.length.should.equal(1)
        })
    });
    describe('When invoked with bad arguments', function() {
        it('should raise an error', function() {
            inject(function(iResourceVariables) {
                try {
                    iResourceVariables();
                    expect(true)
                    .to.be.false
                } catch (Error) {
                    expect(true)
                    .to.be.true
                }
                try {
                    iResourceVariables({});
                    expect(true)
                    .to.be.false
                } catch (Error) {
                    expect(true)
                    .to.be.true
                }
                try {
                    iResourceVariables({
                        notRight: 1
                    });
                    expect(true)
                    .to.be.false
                } catch (Error) {
                    expect(true)
                    .to.be.true
                }
            })
        })
    })
})
