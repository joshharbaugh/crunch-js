var mainModule = require('../index')
    ,mocks = require('angular-mocks')

'use strict';
describe('ShojiResourceFactory', function() {
    function NullDataStrategy(){
        this.initialize = function(){}
        this.get = function(){}
        this.allowAll = function(){}
    }
    function buildShoji(){
        var mod = mainModule('shoji.test')
        angular.mock.module('shoji.test')
        return mod
    }

    describe('invocation', function() {
        var Resource;;
        beforeEach(function(){
            buildShoji()
        })
        beforeEach(function() {
            inject(function(Shoji){
                Resource = Shoji('/my/url/')
            })
            //var dataStrategy = function() {
                //return function() {
                    //this.get = function() {}
                //}
            //};
            //Resource = ShojiResourceFactory($q, _, dataStrategy, parser)('/my/url/')
        });
        it('should expose url', function() {
            Resource.self.should.equal('/my/url/')
        })
    });
    describe('when syncing an resource entity', function() {
        var res;
        beforeEach(function(){
            var mod = buildShoji()
            mod.factory('shojiDataStrategy', function(){
                return NullDataStrategy
            })
        })
        beforeEach(function() {
            var fixture = {
                self: '/my/url/'
                , element: 'shoji:entity'
                , specification: '/s1/'
                , body: {
                    name: 'meh'
                    , arr: ['a']
                }
                , urls: {
                    a_url: '/a1/'
                    , b_url: '/b1/'
                }
            };
            inject(function(Shoji, $rootScope){
                var Resource = Shoji(fixture.self)
                res = Resource.parse(fixture)
                $rootScope.$digest()
            })
            res.reset()
        });
        it('should not wipe out self', function() {
            res.self.should.equal('/my/url/')
        });
        it('should not wipe out element', function() {
            res.element.should.equal(
                'shoji:entity')
        });
        it('should wipe out urls', function() {
            expect(res.urls)
                .not.to.exist
        });
        it('should wipe out specification', function() {
            expect(res.specification)
                .not.to.exist
        });
        it(
            'should wipe out properties from previous request', function() {
                expect(res.name)
                    .not.to.exist;
                expect(res.arr)
                    .not.to.exist
            });
        it('should not wipe out functions', function() {
            expect(res.get)
                .to.exist
        })
    });

    describe('when parsing a resource', function() {
        var $rootScope
            ,fixture
            ,parsed
            ,allMethodsAllowed
            ;
        beforeEach(function(){
            var mod = buildShoji()
            mod.factory('shojiDataStrategy',function($q){
                return function Allowable(){
                    this.initialize = function(){}
                    this.get = function(){
                        return $q.when({})
                    }
                    this.allowAll = function(){
                        allMethodsAllowed = true
                    }
                }
            })
        })
        beforeEach(function(){
            fixture = {
                element: 'shoji:entity'
                , self: '/my/url/'
                , body: {
                    numeric_value: ''
                    , description: 'Cups of coffee per week'
                    , tags: ['tag 1', 'tag 2']
                    , name: 'Measure_Date'
                    , header_order: 1
                    , subtype: 'float'
                    , alias: 'measure_Date'
                    , source: ''
                    , id: '517840dd375e4f55f250a20b'
                    , original_alias: 'coffeeConsumption'
                    , type: 'numeric'
                    , dataset_id: '517840dd375e4f55f250a207'
                    , categories: []
                    , view: {
                        show_counts: false
                        , show_numeric_values: true
                    }
                }
                , urls: {
                    summary_url: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/variables/measure_Date/summary/'
                    , cast_url: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/variables/measure_Date/cast/'
                    , values_url: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/variables/measure_Date/values/'
                }
            };
            inject(function(Shoji, _$rootScope_){
                $rootScope = _$rootScope_
                var Resource = Shoji(fixture.self)
                parsed = Resource.parse(fixture);
            })
        })
        it('should result in a resource instance', function() {
            parsed.numeric_value.should.equal('');
            parsed.name.should.equal('Measure_Date')
        })
        it('should allow all methods', function() {
            allMethodsAllowed.should.be.true
        })
    })
})
