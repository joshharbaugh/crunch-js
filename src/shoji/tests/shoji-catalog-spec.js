'use strict';
var mainModule = require('../index')
    ,H = require('./http-helper')
    ;

describe('ShojiCatalog',function(){

    var h
        ,headers = {ALLOW:'GET,POST'}
        ;
    beforeEach(function(){
        var mod = mainModule('shoji.test')
    })
    H('shoji.test')

    describe('when loading a catalog having views',function(){
        var fixture
            ,Resource
        beforeEach(function(){
            fixture = {
                element: 'shoji:catalog'
                ,self: '/api/things/'
                ,views: {
                    'aa':'/aa1/'
                    ,'bb':'/bb2/'
                }
                ,index: {
                    '/thing/1/': {
                        name: 'one'
                    }
                    ,'/thing/2/': {
                        name: 'two'
                    }
                }
            }
        })
        beforeEach(function(){
            this.$httpBackend.expectGET(fixture.self).respond(200,fixture,headers)
        })
        beforeEach(function(){
            inject(function(Shoji){
                Resource = Shoji(fixture.self)
            })
        })
        it('should chain each view',function(){
            Resource.map().then(function(res){
                expect(res.views).to.exist
                res.views['aa'].self.should.equal('/aa1/')
                res.views['bb'].self.should.equal('/bb2/')
            })
            this.$httpBackend.flush()
        })

    })
    describe('when loading a catalog having an index',function(){
        var fixture
            ,Resource
        beforeEach(function(){
            fixture = {
                element: 'shoji:catalog'
                ,self: '/api/things/'
                ,index: {
                    '/thing/1/': {
                        name: 'one'
                    }
                    ,'/thing/2/': {
                        name: 'two'
                    }
                }
            }
        })
        beforeEach(function(){
            this.$httpBackend.expectGET(fixture.self).respond(200,fixture,headers)
        })
        beforeEach(function(){
            inject(function(Shoji){
                Resource = Shoji(fixture.self)
            })
        })

        it('should expose the index as a collection',function(done){
            Resource.map().then(function(res) {
                expect(res).to.have.property('index')
                done()
            })
            this.$httpBackend.flush()
        })

    })

})
