var shojiModule = require('../index');
var mocks = require('angular-mocks')
module.exports = (function() {
    'use strict';
    describe('ShojiSerializer', function() {
        var $httpBackend
            , Shoji;;
        beforeEach(function() {
            shojiModule('shoji.serialize', {
                cacheable: false
                , offline: false
            })
        });
        beforeEach(angular.mock.module('shoji.serialize'));
        beforeEach(inject(function(_$httpBackend_, _Shoji_) {
            $httpBackend = _$httpBackend_;
            Shoji = _Shoji_
        }));
        afterEach(function() {
            try {
                inject(function($rootScope) {
                    $rootScope.$destroy();
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest()
                })
            } catch (err) {
                console.error(err)
            }
        });
        describe('when serializing a shoji entity', function() {
            var entity;
            beforeEach(function() {
                var entityResponse = {
                    element: 'shoji:entity'
                    , self: '/entity/123/'
                    , description: 'Something'
                    , body: {
                        name: 'bob'
                    }
                    , urls: {
                        a_url: '/entity/123/a'
                        , b_url: '/entity/123/b'
                    }
                };
                entity = Shoji('/entity/123/')
                    .parse(entityResponse)
            });
            describe('given no mapped resources', function() {
                    it(
                        'should return a JSON string with its attributes', function() {
                            inject(function(
                                shojiSerializer) {
                                var str =
                                    shojiSerializer.serialize(
                                        entity);
                                var expect = '{' +
                                    '"element":"shoji:entity"' +
                                    ',"self":"/entity/123/"' +
                                    ',"description":"Something"' +
                                    ',"body":{' +
                                    '"name":"bob"' +
                                    '}' + ',"urls":{' +
                                    '"a_url":"/entity/123/a"' +
                                    ',"b_url":"/entity/123/b"' +
                                    '}' +
                                    '}';
                                str.should.equal(
                                    expect)
                            })
                        })
                })
        });
        describe('when deserializing a resource', function() {
            describe('given no mapped resources', function() {
                    it(
                        'should return hydrated Shoji resource', function() {
                            inject(function(
                                shojiSerializer) {
                                var str = '{' +
                                    '"element":"shoji:entity"' +
                                    ',"self":"/entity/123/"' +
                                    ',"description":"Something"' +
                                    ',"body":{' +
                                    '"name":"bob"' +
                                    '}' + ',"urls":{' +
                                    '"a_url":"/entity/123/a"' +
                                    ',"b_url":"/entity/123/b"' +
                                    '}' + '}';
                                var res =
                                    shojiSerializer.deserialize(
                                        str);
                                res.element.should.equal(
                                    'shoji:entity');
                                res.self.should.equal(
                                    '/entity/123/');
                                res.name.should.equal(
                                    'bob');
                                res.urls.a.self.should
                                    .equal(
                                        '/entity/123/a'
                                );
                                res.urls.b.self.should
                                    .equal(
                                        '/entity/123/b'
                                )
                            })
                        })
                })
        })
    })
})
    .call(this);
