var mainModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
'use strict';
describe('ShojiCollection', function() {
    beforeEach(function() {
        mainModule('shoji.test')

        angular.mock.module('shoji.test');
    });
    describe('when parsing a collection', function() {
        it('should map each item', function(done) {
            inject(function(ShojiCollection, $rootScope, $q) {
                var target = {
                    chain: function(url) {
                        return {
                            self: url
                            , map: function() {
                                return $q.when(this)
                            }
                        }
                    }
                };
                var entities = {
                    'a':'/a'
                    ,'b':'/b'
                    ,'c':'/c'
                }
                var sut = ShojiCollection.parse(
                    target, entities);

                function mapFn(item) {
                    return {
                        self: item.self + 'YYY'
                    }
                }
                sut.map(mapFn)
                    .then(function(col) {
                        try {
                            col['a'].self.should.equal('/aYYY');
                            col['b'].self.should.equal('/bYYY');
                            col['c'].self.should.equal('/cYYY');
                            done()
                        } catch(e) {
                            done(e)
                        }
                    });
                $rootScope.$apply()
            })
        })
    });
    describe('given an hash', function() {
        var sut
            ,$rootScope;
        beforeEach(function() {
            inject(function(ShojiCollection, _$rootScope_, $q){
                $rootScope = _$rootScope_
                var target = {
                    chain: function(url) {
                        return {
                            self: url
                            , map: function() {
                                var res = {
                                    self: url
                                    , name: url
                                };
                                return $q.when(res)
                            }
                        }
                    }
                };
                var urls = {
                    a_url: '/a'
                    , b_url: '/b'
                    , c_url: '/c'
                };
                sut = ShojiCollection.parse(target, urls)
            })
        });
        it('should expose a size property', function() {
            sut.length.should.equal(3)
        });
        it('should expose keyed url access', function() {
            sut.a.self.should.equal('/a');
            sut.c.self.should.equal('/c')
        });
        it.skip('should expose elements as readonly', function() {
                function writing() {
                    sut.a = {}
                }
                expect(writing)
                    .to.
                throw (
                    /Cannot assign to read only property 'a'/
                )
            });
        it( 'should Promise a map of all resolved items', function() {
                var resolved = null;
                var items = sut.map()
                    .then(function(these) {
                        resolved = these
                    });
                expect(items.then)
                    .to.exist;
                $rootScope.$apply();
                resolved.a.self.should.equal('/a');
                resolved.a.name.should.equal('/a')
            });
        it('should support reduce', function() {
            var results = {};
            sut.reduce(function(prev, cur) {
                prev[cur.self] = cur.self +
                    'meh';
                return prev
            }, results);
            results['/a'].should.equal('/ameh')
        });
        it('should support forEach', function() {
            var items = [];
            sut.forEach(function(it) {
                items.push(it)
            });
            items[0].self.should.equal('/a');
            items[1].self.should.equal('/b')
        });
        it('should support toArray', function() {
            var arr = sut.toArray();
            arr[0].self.should.equal('/a');
            arr[1].self.should.equal('/b')
        });
        it('should only enumerate collected values', function() {
                var keys = [];
                for (var key in sut) {
                    if (sut.hasOwnProperty(key)) {
                        keys.push(key)
                    }
                }
                keys.length.should.equal(3);
                keys[0].should.equal('a');
                keys[1].should.equal('b');
                keys[2].should.equal('c')
            })
    })
})
