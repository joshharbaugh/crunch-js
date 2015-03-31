var mainModule = require('../index')
    ,mocks = require('angular-mocks')
    ,fixtures = require('./shoji-fixtures')

module.exports = (function() {
    'use strict';
    describe('ShojiParser', function() {
        beforeEach(function(){
            var mod  = mainModule('shoji.test')
            angular.mock.module('shoji.test')
        })
        var sut;
        beforeEach(function() {
            inject(function(shojiParser) {
                sut = shojiParser
            })
        });
        describe('when parsing shoji view', function() {
            var chained
                , json
                , target;
            beforeEach(function() {
                chained = [];
                target = {
                    chain: function(url) {
                        chained.push(url)
                    }
                };
                json = {
                    self: '/any/where/'
                    ,element: 'shoji:view'
                    ,value: {

                    complex: {
                            object: 'here'
                        }
                        , element: 'barf'
                    }
                };
                sut(json, target)
            });
            it('should set element type', function() {
                target.element.should.equal(
                    'shoji:view')
            });
            it('should namespace value', function() {
                target.value.should.eql({
                    complex: {
                        object: 'here'
                    }
                    , element: 'barf'
                })
            })
        });
        describe('when parsing shoji value', function() {
            var chained
                , json
                , target;;
            beforeEach(function() {
                chained = [];
                target = {
                    chain: function(url) {
                        chained.push(url)
                    }
                };
                json = {
                    complex: {
                        object: 'here'
                    }
                    , element: 'barf'
                };
                sut(json, target)
            });
            it('should set element type', function() {
                target.element.should.equal(
                    'shoji:value')
            });
            it('should namespace value', function() {
                target.value.should.eql({
                    complex: {
                        object: 'here'
                    }
                    , element: 'barf'
                })
            })
        });
        describe('when parsing shoji catalog', function() {
            var chained
                , json
                , target;
            beforeEach(function() {
                chained = [];
                target = {
                    self: 'http://localhost:8000/api/datasets'
                    , chain: function(url) {
                        chained.push(url)
                        return {
                            self: url
                            ,element: 'shoji:entity'
                        }
                    }
                };
                json = {
                    element: 'shoji:catalog'
                    , self: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/all_variables/'
                    , specification: 'http://localhost:8000/api/dataset/specification'
                    , index: {
                        '/aa/':{}
                        , '/bb/':{}
                        , '/cc/':{}
                    }
                    , orders: {
                        hier : '/hier'
                    }
                    , catalogs: {
                        cat: '/cat'
                    }
                    , urls : {
                        'aa' : '/aa/'
                    }
                };
                sut(json, target)
            });
            it('should set self', function() {
                target.self.should.equal(json.self)
            });
            it('should set element type', function() {
                target.element.should.equal(
                    'shoji:catalog')
            });
            it('should expose chainable tuples', function() {
                target.index.length.should.equal(3)
                expect(target.index['/aa/'].map).to.be.an('function')
            });
            it('should chain specification', function() {
                chained.should.contain(json.specification)
            })

            it('should expose orders', function() {
                expect(target.orders.hier.self).to.equal('/hier')
            })

            it('should expose subcatalogs', function() {
                expect(target.catalogs.cat.self).to.equal('/cat')
            })

            it('should expose urls', function() {
                expect(target.urls).not.to.be.undefined
                expect(target.urls.aa).not.to.be.undefined
            })
        });

        describe('when parsing a shoji order', function() {
            var chained
                , json
                , target
                ;

            beforeEach(function() {
                chained = []
                target = {
                    chain : function(url) {
                        chained.push(url)
                    }
                }

                sut(fixtures.shojiOrder, target)
            })

            it('should set self', function() {
                expect(target.self).to.equal(fixtures.shojiOrder.self)
            })

            it('should set element type', function() {
                expect(target.element).to.equal('shoji:order')
            })

            it('should set graph property', function() {
                expect(target.graph).to.equal(fixtures.shojiOrder.graph)
            })
        })

        describe('when parsing shoji element', function() {
            var chained
                , json
                , target;;
            beforeEach(function() {
                chained = [];
                target = {
                    chain: function(url) {
                        chained.push(url)
                    }
                };
                json = {
                    element: 'shoji:entity'
                    , self: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/all_variables/'
                    , specification: 'http://api/datasets/specification'
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
                    ,fragments: {
                        table_fragment: 'http://localhost:8000/table'
                    }
                    ,views: {
                        table_view: 'http://localhost:8000/table'
                    }
                    ,catalogs: {
                        table_catalog: 'http://localhost:8000/table'
                    }
                    , urls: {
                        summary_url: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/variables/measure_Date/summary/'
                        , cast_url: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/variables/measure_Date/cast/'
                        , values_url: 'http://localhost:8000/api/datasets/517840dd375e4f55f250a207/variables/measure_Date/values/'
                    }
                };
                sut(json, target)
            });
            it('should set self', function() {
                target.self.should.equal(json.self)
            });
            it('should set element type', function() {
                target.element.should.equal(
                    'shoji:entity')
            });
            it('should augment with body', function() {
                target.description.should.equal(
                    'Cups of coffee per week');
                target.categories.should.eql([]);
                target.view.should.eql({
                    show_counts: false
                    , show_numeric_values: true
                })
            });
            it('should chain urls', function() {
                chained.should.contain(json.urls.summary_url);
                chained.should.contain(json.urls.cast_url);
                chained.should.contain(json.urls.values_url)
            });
            it('should chain fragments, views, catalogs', function() {
                chained.should.contain(json.views.table_view);
                chained.should.contain(json.fragments.table_fragment);
                chained.should.contain(json.catalogs.table_catalog);
            });
            it('should chain specification', function() {
                chained.should.contain(json.specification)
            })
        })
    })
})
    .call(this);
