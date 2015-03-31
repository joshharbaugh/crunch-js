'use strict';

var mainModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('ShojiEntity',function(){
    var headers = {
        ALLOW: 'GET,PATCH'
    }
    var $httpBackend
        ,fixtures
        ,sut
    ;

    beforeEach(function(){
        var mod = mainModule('shoji.test')
        angular.mock.module('shoji.test')
    })
    beforeEach(function(){
        inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_
        })
    })
    afterEach(function(){
        sut = null
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest()
    })
    describe('#patch',function(){

        describe('when PATCHing an entity',function(){
            beforeEach(function(){
                fixtures= {
                    pre: {
                        element: 'shoji:entity'
                        ,self: '/my/entity/'
                        ,body: {
                            name: 'aa'
                        }
                    }
                    ,post: {
                        element: 'shoji:entity'
                        ,self: '/my/entity/'
                        ,body: {
                            name: 'bb'
                        }
                    }

                }
            })
            beforeEach(function(){
                $httpBackend.expectGET(fixtures.pre.self)
                    .respond(200, fixtures.pre, headers)
                $httpBackend.expectPATCH(fixtures.pre.self, {
                        name: 'bb'
                    }
                ).respond(200, fixtures.pre, headers)
                $httpBackend.expectGET(fixtures.post.self)
                    .respond(200, fixtures.post, headers)
            })

            beforeEach(function(){
                inject(function(Shoji){
                    Shoji(fixtures.pre.self).map()
                        .then(function(it){
                            sut = it
                            sut.patch({
                                data: {
                                    name: 'bb'
                                }
                            })
                        })
                })
                $httpBackend.flush()
            })
            it('should resync upon success',function(){
                sut.name.should.equal('bb')
            })

        })

    })

})
