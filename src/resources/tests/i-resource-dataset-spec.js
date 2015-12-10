;
module.exports = (function() {
    'use strict';
    var mainModule = require('../index')
        ,shojiModule = require('../../shoji/index')
        ,mocks = require('angular-mocks')
        ,fixtures = require('../../test-support/fixtures/dataset-entity');
    describe('IResourceDataset', function() {
        var $httpBackend
            , headers = {
                ALLOW: 'GET,POST,PUT,DELETE'
            }
            , main;

        function GET(fixture, params) {
            $httpBackend.expectGET(fixture.self)
            .respond(200, fixture, headers)
        }

        function mockServices(main) {
            main.factory('iResourceDatasets', function(Shoji, $q) {
                return function() {
                    var res = Shoji('/api/users/test_user/')
                        .parse({
                            self: '/api/users/test_user/datasets/'
                            , element: 'shoji:catalog'
                            ,index: {
                                '/api/datasets/123/':{}
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
        describe('when invoked', function() {
            var result;
            beforeEach(function() {
                GET(fixtures.dataset)
            });
            beforeEach(function() {
                inject(function(iResourceDataset) {
                    var q = {
                        datasetId: fixtures.dataset.self
                    };
                    iResourceDataset(q)
                        .then(function(its) {
                            result = its
                        });
                    $httpBackend.flush()
                })
            });
            it('should fetch dataset', function() {
                result.self.should.equal(fixtures.dataset
                    .self)
            })
        })
    })
})
    .call(this);
