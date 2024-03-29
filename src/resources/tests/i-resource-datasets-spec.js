'use strict';
var mainModule = require('../index'),
    shojiModule = require('../../shoji/index'),
    mocks = require('angular-mocks'),
    fixtures = {
        api : require('../../test-support/fixtures/root'),
        datasets : require('../../test-support/fixtures/dataset-catalog'),
        datasetsOnly123 : require('../../test-support/fixtures/dataset-catalog-1')
    };

describe('IResourceDatasets', function() {
    var $httpBackend
        , headers = {
    ALLOW: 'GET,POST,PUT,DELETE'
        }
        , main;

    function GET(fixture, params) {
        $httpBackend.expectGET(fixture.self)
        .respond(200, fixture, headers)
    }

    beforeEach(function() {
        main = mainModule('resource.test');
        shojiModule('shoji.test');
        angular.mock.module('resource.test', 'shoji.test')
    });
    beforeEach(function() {
        inject(function(_$httpBackend_, _Shoji_) {
            $httpBackend = _$httpBackend_;
            _Shoji_.API = _Shoji_('/api/')
        })
    });
    describe(
        'when fetching datasets catalog for current user', function() {
        var result;
        describe('given no dataset_id', function() {
            beforeEach(function() {
                GET(fixtures.api)
                GET(fixtures.datasets);
                inject(function(iResourceDatasets) {
                    iResourceDatasets()
                    .then(function(its) {
                        result = its
                    })
                });
                $httpBackend.flush()
            });
            it(
                'should return the datasets catalog', function() {
                result.self.should.equal(
                    fixtures.datasets.self);
                    result.index.length.should
                    .equal(4)
            })
        })
    });
    describe(
        'when fetching specific dataset for current user', function() {
        var result;
        describe('given a dataset_id', function() {
            beforeEach(function() {
                GET(fixtures.api)
                GET(fixtures.datasetsOnly123, '?dataset_id=123');
                inject(function(iResourceDatasets) {
                    iResourceDatasets({
                        datasetId: '123'
                    })
                    .then(function(its) {
                        result = its
                    })
                });
                $httpBackend.flush()
            });
            it(
                'should return the datasets catalog', function() {
                result.self.should.equal(
                    fixtures.datasets.self);
                    result.index.length.should
                    .equal(1)
            })
        })
    })
})
