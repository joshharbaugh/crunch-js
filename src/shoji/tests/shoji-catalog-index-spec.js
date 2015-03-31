'use strict';

var mainModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('ShojiCatalogIndex',function(){
    var $httpBackend

    beforeEach(function(){
        var mod = mainModule('shoji.cats')
        angular.mock.module('shoji.cats')
    })
    beforeEach(function(){
        inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_
        })
    })
    afterEach(function() {
        try {
            inject(function($rootScope, _$httpBackend_) {
                $rootScope.$destroy();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest()
            })
        } catch (err) {
            console.error(err)
        }
    });

    describe('Given typical valid index',function(){
        var index
        beforeEach(function(){
            index = {
                "123ada/": {
                    "name": "C",
                    "order": 1,
                    "tags": ["Key Performance Indicators"],
                    "archived": false
                },
                "df53f2/": {
                    "name": "F",
                    "order": 2,
                    "tags": ["Key Performance Indicators"],
                    "archived": false
                },
                "82e09e/": {
                    "name": "A1",
                    "order": 3,
                    "tags": ["Demographics"],
                    "archived": true
                },
                "bb32dd/": {
                    "name": "A2",
                    "order": 4,
                    "tags": ["Demographics"],
                    "archived": false
                },
                "ff632d/": {
                    "name": "Z",
                    "order": 5,
                    "tags": [],
                    "archived": false
                }

            }
        })
        describe('when created',function(){
            var sut
            beforeEach(function(){
                inject(function(Shoji, ShojiCatalogIndex, $rootScope){
                    sut = ShojiCatalogIndex.create(Shoji('/cat/'),index)
                })
            })
            it('should expose tuple attributes [as bracket notation]',function(){
                sut['bb32dd/'].name.should.equal('A2')
                sut['ff632d/'].name.should.equal('Z')
            })
            it('should expose thru `tuple` accessor',function(){
                sut.tuple('82e09e/').name.should.equal('A1')
                sut.tuple('82e09e/').order.should.equal(3)
                sut.tuple('82e09e/').tags.should.eql(['Demographics'])
                sut.tuple('82e09e/').archived.should.be.true

            })

        })
        describe('when mapResources without args',function(){
            var sut
                ,headers = {
                    ALLOW: 'GET,POST'
                }
            beforeEach(function(){
                Object.keys(index).forEach(function(url){
                    $httpBackend.expectGET('/cat/' + url).respond(200,{
                        element: 'shoji:entity'
                        ,self:url
                        ,body: {}
                    },headers)
                })
            })
            beforeEach(function(){
                inject(function(Shoji, ShojiCatalogIndex, $rootScope){
                    sut = ShojiCatalogIndex.create(Shoji('/cat/'),index)
                })
            })

            it('should map resources being referenced',function(){
                sut.mapResources().then(function(arr){
                    arr.length.should.equal(Object.keys(index).length)
                    arr.should.contain.something.with.property('self','ff632d/')
                    arr.should.contain.something.with.property('self','123ada/')
                    arr.should.contain.something.with.property('self','df53f2/')
                    arr.should.contain.something.with.property('self','82e09e/')
                    arr.should.contain.something.with.property('self','bb32dd/')
                })
                $httpBackend.flush()
            })
        })
        describe('Given tuple',function(){
            describe('When mapping the tuple',function(){
                var sut
                beforeEach(function(){
                    $httpBackend.expectGET('/cat/'+'bb32dd/').respond(200,{
                        element: 'shoji:entity'
                        ,self:'bb322dd/'
                        ,body: {
                            foo: 'bar'
                        }
                    },{
                        ALLOW: 'GET,POST'
                    })
                })
                beforeEach(function(){
                    inject(function(Shoji, ShojiCatalogIndex, $rootScope){
                        sut = ShojiCatalogIndex.create(Shoji('/cat/'),index)
                    })
                })
                it('should blend the tuple attributes on the resource',function(){
                    var tuple = sut['bb32dd/']
                    expect(tuple).to.exist
                    expect(tuple.map).to.exist

                    tuple.map().then(function(res){
                        res.should.contain.property('self','bb322dd/')
                        res.should.contain.property('foo','bar')
                    })
                    $httpBackend.flush()
                })

            })

        })
        describe('When parsed with a valid index',function(){
            var sut
                ;
            beforeEach(function(){
                inject(function(Shoji, ShojiCatalogIndex, $rootScope){
                    sut = ShojiCatalogIndex.create(Shoji('/cat/'),index)
                })
            })
            it('should expose an url->tuple dictionary',function(){
                sut.should.contain.keys(Object.keys(index))
            })
        })

    })

})
