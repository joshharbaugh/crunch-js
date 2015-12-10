;
module.exports = (function() {
    'use strict';
    var mainModule = require('../index')
        ,shojiModule = require('../../shoji/index')
        ,fixtures = require('./fixtures')
        ,mocks = require('angular-mocks')
        ,_ = require('lodash');
    
    fixtures.dataset = require('../../test-support/fixtures/dataset-entity')
    
    describe('IFetchCubes', function() {
        var mod
            , $httpBackend
            , headers = {
                ALLOW: 'GET,POST,PUT,DELETE'
            };

        function GET(fixture, params) {
            return $httpBackend.expectGET(fixture.self)
                .respond(200, fixture, headers)
        }
        beforeEach(function() {
            mod = mainModule('cube.test');
            mod.factory('currentDataset', function(
                Shoji, $q) {
                return {fetch: function(q) {
                    return $q.when(Shoji(fixtures.dataset
                            .self)
                        .parse(fixtures.dataset))
                }}
            });
            shojiModule('shoji.test');
            angular.mock.module('cube.test', 'shoji.test')
        });
        beforeEach(function() {
            inject(function(_$httpBackend_, _Shoji_) {
                $httpBackend = _$httpBackend_;
                _Shoji_.API = _Shoji_('/api/')
            })
        });
        describe('given query, should return the cube',function() {
            var sut
                ,query
                ,result
                ;
            // from $resource:
            // https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js#L397
            function encodeUriQuery(val, pctEncodeSpaces) {
                return encodeURIComponent(val).
                    replace(/%40/gi, '@').
                    replace(/%3A/gi, ':').
                    replace(/%24/g, '$').
                    replace(/%2C/gi, ',').
                    replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
            }
            beforeEach(function() {
                $httpBackend.expectGET(
                    '/api/datasets/123/cube/?query='+encodeUriQuery(angular.toJson(fixtures.query))
                )
                    .respond(200, fixtures.categoricalCount, headers);

                inject(function(iFetchCubes) {
                    sut = iFetchCubes
                    sut({datasetId: fixtures.dataset.self
                        ,query: fixtures.query
                    }).then(function(it) {
                        result = it
                    })
                });
                $httpBackend.flush();
            })
            it('should provide an object with the response',function() {
                result.should.eql(fixtures.categoricalCount.value)
            })
        })
    })
})
    .call(this);
