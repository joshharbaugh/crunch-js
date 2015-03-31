    'use strict';
    var shoji = require('../index')
        ,mocks = require('angular-mocks')
    describe('shoji module', function() {
        var $httpBackend
            , Shoji;;
        beforeEach(function() {
            shoji('shoji.api', {
                cacheable: false
                , offline: false
            })
        });
        beforeEach(function(){
            angular.mock.module('shoji.api');
        })
        beforeEach(function(){
            inject(function(_$httpBackend_, _Shoji_) {
                $httpBackend = _$httpBackend_;
                Shoji = _Shoji_
            });
        })
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
        describe('api', function() {
            describe( 'when instantiating resource by parse', function() {
                var cow;
                beforeEach(function() {
                    var Resource = Shoji(
                        'http://x.com/cowz/0001');
                    cow = Resource.parse({
                        self: 'http://x.com/cowz/0001'
                        , element: 'shoji:entity'
                        , body: {
                            color: 'brown'
                        }
                        , urls: {}
                    });
                    expect(cow.get)
                        .to.exist;
                    $httpBackend.expectGET(
                        'http://x.com/cowz/0001')
                        .respond(200, {
                            element: 'shoji:entity'
                            , self: 'http://x.com/cowz/0001'
                            , specification: 'http://x.com/specifications/cowz'
                            , body: {
                                color: 'tan'
                            }
                            , urls: {
                                horses_url: 'http://x.com/horses/'
                                , donkeys_url: 'http://x.com/donkeys/'
                            }
                        }, {
                            ALLOW: 'GET, HEAD, PUT, POST'
                        });
                    cow.get();
                    $httpBackend.flush()
                });
                it('should permit all methods on underlying data access', function() {
                    cow.color.should.equal('tan')
                });
            });
            describe('when creating new resource via POST', function() {
                var Resource;
                beforeEach(function() {
                    $httpBackend.expectGET(
                        'http://x.com/cows/')
                        .respond(200, {
                            element: 'shoji:catalog'
                            , self: 'http://x.com/cows/'
                            , specification: 'http://x.com/specifications/cows'
                            , index: {}
                        }, {
                            ALLOW: 'GET, HEAD, PUT, POST'
                        });
                    Resource = Shoji(
                        'http://x.com/cows/')
                });
                describe('given unspecified sync option', function() {
                    it( 'should resolve new resource', function() {
                        var cows
                        Resource.map().then(function(result){
                            cows = result
                        })
                        $httpBackend.flush();
                        cows.element.should.equal(
                            'shoji:catalog');
                        $httpBackend.expectPOST(
                            'http://x.com/cows/'
                        ).respond(200, {
                            says: 'moi'
                            , color: 'red'
                        }, {
                            Location: 'http://x.com/cows/0002'
                        });
                        cows.save({
                            color: 'tan'
                        }).then(function(cow) {
                                cow.self.should
                                    .equal(
                                        'http://x.com/cows/0002'
                                )
                            });
                        $httpBackend.flush()
                    })
                })
            });
            describe('when changing state on resource', function() {
                    var Resource;
                    beforeEach(function() {
                        $httpBackend.expectGET(
                            'http://x.com/cows/0001')
                            .respond(200, {
                                element: 'shoji:entity'
                                , self: 'http://x.com/cows/0001'
                                , specification: 'http://x.com/specifications/cows'
                                , body: {
                                    says: 'moo'
                                    , color: 'brown'
                                }
                                , urls: {
                                    horses_url: 'http://x.com/horses/'
                                    , donkeys_url: 'http://x.com/donkeys/'
                                }
                            }, {
                                ALLOW: 'GET, HEAD, PUT, POST'
                            });
                        Resource = Shoji( 'http://x.com/cows/0001')
                    });
                    describe('given unspecified sync option', function() {
                        it('should sync state after PUTs', function() {
                            var cow;
                            Resource.map().then(function(result){
                                cow = result
                            })
                            $httpBackend.flush();
                            cow.element.should.equal(
                                'shoji:entity');
                            cow.color.should.equal(
                                'brown');
                            $httpBackend.expectPUT(
                                'http://x.com/cows/0001'
                            )
                                .respond(200, {}, {});
                            $httpBackend.expectGET(
                                'http://x.com/cows/0001'
                            )
                                .respond(200, {
                                    element: 'shoji:entity'
                                    , self: 'http://x.com/cows/0001'
                                    , specification: 'http://x.com/specifications/cows'
                                    , body: {
                                        says: 'moo'
                                        , color: 'tan'
                                    }
                                    , urls: {
                                        horses_url: 'http://x.com/horses/'
                                        , donkeys_url: 'http://x.com/donkeys/'
                                    }
                                }, {
                                    ALLOW: 'GET, HEAD, PUT, POST'
                                });
                            cow.update({
                                color: 'tan'
                            });
                            $httpBackend.flush();
                            cow.color.should.equal(
                                'tan')
                        })
                    });
                    describe('given false sync option', function() {
                        it( 'should sync state after PUTs', function() {
                            var cow ;
                            Resource.map().then(function(res){
                                cow = res
                            })
                            $httpBackend.flush();
                            cow.element.should.equal(
                                'shoji:entity');
                            cow.color.should.equal(
                                'brown');
                            $httpBackend.expectPUT(
                                'http://x.com/cows/0001'
                            ).respond(200, {}, {});
                            cow.update({
                                color: 'tan'
                                , sync: false
                            });
                            $httpBackend.flush();
                            cow.color.should.equal(
                                'brown')
                        })
                    })
                });
            describe('when deleting a resource', function() {
                var allow;
                beforeEach(function() {
                    allow = {
                        ALLOW: 'GET, HEAD, DELETE'
                    };
                    $httpBackend.expectGET(
                        'http://x.com/cows/0001')
                        .respond(200, {
                            element: 'shoji:entity'
                            , self: 'http://x.com/cows/0001'
                            , specification: 'http://x.com/specifications/cows'
                            , body: {
                                says: 'moo'
                                , color: 'brown'
                            }
                            , urls: {
                                horses_url: 'http://x.com/horses/'
                                , donkeys_url: 'http://x.com/donkeys/'
                            }
                        }, allow)
                });
                it('should remove all data access', function() {
                        var Resource = Shoji(
                            'http://x.com/cows/0001');
                        var cow;
                        Resource.map(function(res){
                            cow = res
                            cow.element.should.equal(
                                'shoji:entity');
                            cow.color.should.equal(
                                'brown')
                        })
                        $httpBackend.flush();
                        $httpBackend.expectDELETE(
                            'http://x.com/cows/0001')
                            .respond(200, {}, allow);
                        cow.delete()
                            .then(function(deleted) {
                                deleted.self.should
                                    .equal(
                                        'http://x.com/cows/0001'
                                );

                                function getting() {
                                    deleted.get()
                                }
                                getting.should.
                                throw (
                                    /Resource at http:\/\/x.com\/cows\/0001 has been DELETED/
                                )
                            });
                        $httpBackend.flush()
                    })
            })
        });
        describe('when loading a view',function(){
            it( 'should map result to `value` onto resource', function() {
                    $httpBackend.when('GET', 'http://x.com/cows/0001/udders')
                        .respond(200, {
                            self: 'http://x.com/cows/0001/udders'
                            ,element: 'shoji:view'
                            ,value:[{
                                    causes_to_kick: true
                                    , milked_on: ['monday', 'wednesday'
                                    ]
                                    , udder_no: 1
                                }
                                , {
                                    causes_to_kick: false
                                    , milked_on: ['tuesday', 'thursday'
                                    ]
                                    , udder_no: 2
                                }
                                , {
                                    causes_to_kick: true
                                    , milked_on: ['friday', 'saturday'
                                    ]
                                    , udder_no: 3
                                }
                            ]
                        }, {
                            ALLOW: 'GET, HEAD'
                        });
                    var Resource = Shoji(
                        'http://x.com/cows/0001/udders');
                    var cow = Resource.map(function(c) {
                        c.element.should.equal(
                            'shoji:view');
                        c.value[0].milked_on.should.eql(
                            ['monday', 'wednesday'])
                    });
                    $httpBackend.flush()
                })

        })
        describe('when loading a value', function() {
            it(
                'should map result to `value` onto resource', function() {
                    $httpBackend.when('GET', 'http://x.com/cows/0001/udders')
                        .respond(200, [{
                                causes_to_kick: true
                                , milked_on: ['monday', 'wednesday'
                                ]
                                , udder_no: 1
                            }
                            , {
                                causes_to_kick: false
                                , milked_on: ['tuesday', 'thursday'
                                ]
                                , udder_no: 2
                            }
                            , {
                                causes_to_kick: true
                                , milked_on: ['friday', 'saturday'
                                ]
                                , udder_no: 3
                            }
                        ], {
                            ALLOW: 'GET, HEAD'
                        });
                    var Resource = Shoji(
                        'http://x.com/cows/0001/udders');
                    var cow = Resource.map(function(c) {
                        c.element.should.equal(
                            'shoji:value');
                        c.value[0].milked_on.should.eql(
                            ['monday', 'wednesday'])
                    });
                    $httpBackend.flush()
                })
        });
        describe('when loading an entity', function() {
            it('should return a entity', function() {
                $httpBackend.when('GET', 'http://x.com/cows/0001')
                    .respond(200, {
                        element: 'shoji:entity'
                        , self: 'http://x.com/cows/0001'
                        , specification: 'http://x.com/specifications/cows'
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http://x.com/donkeys/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    });
                var Resource = Shoji(
                    'http://x.com/cows/0001');
                var cow;
                Resource.map(function(c) {
                    cow = c
                    c.element.should.equal(
                        'shoji:entity')
                });
                $httpBackend.flush();
                cow.element.should.equal(
                    'shoji:entity')
            });
            it('should support fetching state from server', function() {
                var allow = {
                    ALLOW: 'GET, HEAD, PUT'
                };
                $httpBackend.expectGET(
                    'http://x.com/cows/0001')
                    .respond(200, {
                        element: 'shoji:entity'
                        , self: 'http://x.com/cows/0001'
                        , specification: 'http://x.com/specifications/cows'
                        , body: {
                            color: 'brown'
                        }
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http://x.com/donkeys/'
                        }
                    }, allow);
                var Resource = Shoji(
                    'http://x.com/cows/0001');
                var cow;
                Resource.map(function(c) {
                    cow  = c
                    c.element.should.equal(
                        'shoji:entity');
                    c.color.should.equal('brown')
                });
                $httpBackend.flush();
                $httpBackend.expectGET(
                    'http://x.com/cows/0001')
                    .respond(200, {
                        element: 'shoji:entity'
                        , self: 'http://x.com/cows/0001'
                        , specification: 'http://x.com/specifications/cows'
                        , body: {
                            color: 'tan'
                        }
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http://x.com/donkeys/'
                        }
                    }, allow);
                cow.get()
                    .then(function(its) {
                        its.color.should.equal(
                            'tan')
                    });
                $httpBackend.flush();
                cow.element.should.equal(
                    'shoji:entity')
            });
            it('should copy -body to resource', function() {
                var allow = {
                    ALLOW: 'GET, HEAD, PUT'
                };
                $httpBackend.when('GET', 'http://x.com/cows/0001')
                    .respond(200, {
                        element: 'shoji:entity'
                        , self: 'http://x.com/cows/0001'
                        , body: {
                            name: 'bessie'
                            , color: 'brown'
                            , udders: {
                                count: 8
                            }
                        }
                        , specification: 'http://x.com/specifications/cows'
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http://x.com/donkeys/'
                        }
                    }, allow);
                var Resource = Shoji(
                    'http://x.com/cows/0001');
                var cow = Resource.map(function(c) {
                    c.name.should.equal('bessie');
                    c.color.should.equal('brown');
                    c.udders.count.should.equal(8)
                });
                $httpBackend.flush()
            });
            it('should expose update', function() {
                $httpBackend.when('GET', 'http://x.com/cows/0001')
                    .respond(200, {
                        element: 'shoji:entity'
                        , specification: 'http://x.com/specifications/cows'
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http://x.com/donkeys/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    });
                var Resource = Shoji(
                    'http://x.com/cows/0001');
                var cow = Resource.map(function(c) {
                    expect(c.update.willFail)
                        .not.to.exist
                });
                $httpBackend.flush()
            });
            it('should not ALLOW restricted update', function() {
                    $httpBackend.when('GET', 'http://x.com/cows/0001')
                        .respond(200, {
                            element: 'shoji:entity'
                            , specification: 'http://x.com/specifications/cows'
                            , urls: {
                                horses_url: 'http://x.com/horses/'
                                , donkeys_url: 'http://x.com/donkeys/'
                            }
                        }, {
                            ALLOW: 'GET, HEAD'
                        });
                    var Resource = Shoji(
                        'http://x.com/cows/0001');
                    var cow = Resource.map(function(c) {
                        function fn() {
                            c.update()
                        }
                        fn.should.
                        throw (
                            /Method 'PUT' not permitted/
                        )
                    });
                    $httpBackend.flush()
                });
            it('should wrap urls with resource factories', function() {
                    $httpBackend.when('GET', 'http://x.com/cows/0001')
                        .respond(200, {
                            element: 'shoji:entity'
                            , self: 'http://x.com/cows/0001'
                            , specification: 'http://x.com/specifications/cows'
                            , urls: {
                                horses_url: 'http://x.com/horses/'
                                , donkeys_url: 'http://x.com/donkeys/'
                            }
                        }, {
                            ALLOW: 'GET, HEAD, PUT'
                        });
                    var Resource = Shoji(
                        'http://x.com/cows/0001');
                    var cow;
                    Resource.map(function(c) {
                        cow = c
                        c.element.should.equal(
                            'shoji:entity')
                    });
                    $httpBackend.flush();
                    cow.urls['horses'].map.should.be.a(
                        'Function');
                    cow.urls['donkeys'].map.should.be.a(
                        'Function')
                })
        });
        describe('when loading a catalog', function() {
            it('should return a catalog', function() {
                $httpBackend.when('GET', 'http://x.com/cows')
                    .respond(200, {
                        element: 'shoji:catalog'
                        , self: 'http://x.com/cows'
                        , specification: 'http://x.com/specifications/cows'
                        , index: {
                            'http://x.com/cows/0001':{}
                            , 'http://x.com/cows/0002':{}
                        }
                    }, {
                        ALLOW: 'GET, HEAD, POST'
                    });
                var Resource = Shoji(
                    'http://x.com/cows');
                var cows = Resource.map(function(c) {
                    c.element.should.equal(
                        'shoji:catalog');
                    c.index.length.should.equal( 2)
                });
                $httpBackend.flush()
            });
            it( 'should wrap specification as resource factory', function() {
                    $httpBackend.when('GET', 'http://x.com/cows')
                        .respond(200, {
                            element: 'shoji:catalog'
                            , specification: 'http://x.com/specifications/cows'
                            , index: {
                                'http://x.com/cows/0001':{}
                                , 'http://x.com/cows/0002':{}
                            }
                        }, {
                            ALLOW: 'GET, HEAD, POST'
                        });
                    $httpBackend.when('GET', 'http://x.com/specifications/cows'
                    )
                        .respond(200, {
                            element: 'shoji:entity'
                            , self: 'http://x.com/specifications/cows'
                            , body: {
                                description: 'meh'
                            }
                        }, {
                            ALLOW: 'GET, HEAD'
                        });
                    var Resource = Shoji(
                        'http://x.com/cows');
                    var cows = Resource.map(function(c) {
                        c.specification.map.should.be
                            .a('Function');
                        c.specification.map(function(
                            spec) {
                            spec.description.should
                                .equal('meh')
                        })
                    });
                    $httpBackend.flush()
                });
            it('should ALLOW only permitted methods', function() {
                    $httpBackend.when('GET', 'http://x.com/cows')
                        .respond(200, {
                            element: 'shoji:catalog'
                            , specification: 'http://x.com/specifications/cows'
                            , index: {
                                'http://x.com/cows/0001':{}
                                , 'http://x.com/cows/0002':{}
                            }
                        }, {
                            ALLOW: 'GET, HEAD'
                        });
                    var Resource = Shoji(
                        'http://x.com/cows');
                    var cows = Resource.map(function(c) {
                        function fn() {
                            c.save()
                        }
                        fn.should.
                        throw (
                            /Method 'POST' not permitted/
                        )
                    });
                    $httpBackend.flush()
                })
        });
        describe('when traversing resources', function() {
            beforeEach(function() {
                $httpBackend.when('GET', 'http://x.com/cows')
                    .respond(200, {
                        self: 'http://x.com/cows/'
                        , element: 'shoji:catalog'
                        , specification: 'http://x.com/specifications/cows'
                        , index: {
                            'http://x.com/cows/0001':{}
                            , 'http://x.com/cows/0002':{}
                        }
                    }, {
                        ALLOW: 'GET, HEAD, POST'
                    });
                $httpBackend.when('GET', 'http://x.com/cows/0001')
                    .respond(200, {
                        self: 'http://x.com/cows/0001'
                        , element: 'shoji:entity'
                        , specification: 'http://x.com/specifications/cows'
                        , body: {
                            name: 'bessie'
                            , color: 'brown'
                        }
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http:/x.com/donkeys/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    });
                $httpBackend.when('GET', 'http://x.com/horses/')
                    .respond(200, {
                        self: 'http://x.com/horses/'
                        , element: 'shoji:catalog'
                        , specification: 'http://x.com/specifications/horses'
                        , index: {
                            'http://x.com/horses/0003':{}
                        }
                    }, {
                        ALLOW: 'GET, HEAD, POST'
                    });
                $httpBackend.when('GET', 'http://x.com/horses/0003')
                    .respond(200, {
                        self: 'http://x.com/horses/0003'
                        , element: 'shoji:entity'
                        , specification: 'http://x.com/specifications/horses'
                        , body: {
                            name: 'silver'
                            , color: 'white'
                        }
                        , urls: {
                            goats_url: 'http://x.com/goats/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    })
            });
            it('should fluently walk resources', function() {
                var Resource = Shoji('http://x.com/cows');
                Resource.map(function(cows) {
                    cows.element.should.equal(
                        'shoji:catalog');
                    cows.self.should.equal(
                        'http://x.com/cows/');
                    cows.index.length.should.equal(2);
                    var cow = cows.index['http://x.com/cows/0001']
                        .map().then(function(c) {
                            c.name.should.equal(
                                'bessie');
                            expect(c.urls[
                                'horses'])
                                .to.exist;
                            expect(c.urls[
                                'donkeys'])
                                .to.exist;
                            var horses = c.urls[
                                'horses'].map(
                                function(h) {
                                    h.index.length.should.equal(1);
                                    var horse = h.index['http://x.com/horses/0003'].map()
                                        .then(function(ho) {
                                                ho.name
                                                    .should
                                                    .equal(
                                                        'silver'
                                                );
                                                ho
                                                    .color
                                                    .should
                                                    .equal(
                                                        'white'
                                                )
                                            })
                                })
                        })
                });
                $httpBackend.flush()
            })
        });
        describe('when reducing resources', function() {
            beforeEach(function() {
                $httpBackend.when('GET', 'http://x.com/cows')
                    .respond(200, {
                        self: 'http://x.com/cows/'
                        , element: 'shoji:catalog'
                        , specification: 'http://x.com/specifications/cows'
                        , index: {
                            'http://x.com/cows/0001':{}
                            , 'http://x.com/cows/0002':{}
                        }
                    }, {
                        ALLOW: 'GET, HEAD, POST'
                    });
                $httpBackend.when('GET', 'http://x.com/cows/0001')
                    .respond(200, {
                        self: 'http://x.com/cows/0001'
                        , element: 'shoji:entity'
                        , specification: 'http://x.com/specifications/cows'
                        , body: {
                            name: 'bessie'
                            , color: 'brown'
                        }
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http:/x.com/donkeys/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    });
                $httpBackend.when('GET', 'http://x.com/horses/')
                    .respond(200, {
                        self: 'http://x.com/horses/'
                        , element: 'shoji:catalog'
                        , specification: 'http://x.com/specifications/horses'
                        , index: {
                            'http://x.com/horses/0003':{}
                        }
                    }, {
                        ALLOW: 'GET, HEAD, POST'
                    });
                $httpBackend.when('GET', 'http://x.com/horses/0003')
                    .respond(200, {
                        self: 'http://x.com/horses/0003'
                        , element: 'shoji:entity'
                        , specification: 'http://x.com/specifications/horses'
                        , body: {
                            name: 'silver'
                            , color: 'white'
                        }
                        , urls: {
                            goats_url: 'http://x.com/goats/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    })
            });
            it('should accumulate results', function() {
                var Resource = Shoji(
                    'http://x.com/cows');
                var accumulator = {
                    cows: []
                    , horses: []
                };

                function fetchCows(acc, cows) {
                    return cows.map()
                }

                function fetchCow(acc, cows) {
                    return cows.index['http://x.com/cows/0001'].map()
                }

                function attachCow(acc, cow) {
                    acc.cows.push(cow);
                    return cow.map()
                }

                function fetchHorses(acc, cow) {
                    return cow.urls.horses.map()
                }

                function fetchHorse(acc, horses) {
                    return horses.index['http://x.com/horses/0001'].map()
                }

                function attachHorse(acc, horse) {
                    acc.horses.push(horse);
                    return acc
                }
                var handlers = [
                    fetchCows, fetchCow, attachCow, fetchHorses, attachHorse
                ];
                Resource.reduce(accumulator, handlers)
                    .then(function() {}, function(err) {
                        throw err;
                        dump(err)
                    });
                $httpBackend.flush();
                accumulator.cows.length.should.equal(
                    1);
                accumulator.horses.length.should.equal(
                    1)
            })
        });
        describe('when attaching urls', function() {
            describe('given invalid path', function() {
                beforeEach(function() {
                    $httpBackend.when('GET', 'http://x.com/cows/0001')
                        .respond(200, {
                            self: 'http://x.com/cows/0001'
                            , element: 'shoji:entity'
                            , specification: 'http://x.com/specifications/cows'
                            , body: {
                                name: 'bessie'
                                , color: 'brown'
                            }
                            , urls: {
                                milk_schedule_url: 'http://x.com/cows/0001/milk_schedule'
                            }
                        }, {
                            ALLOW: 'GET, HEAD, PUT'
                        })
                });
                it('should throw', function() {
                    var cow = null;
                    var Resource = Shoji(
                        'http://x.com/cows/0001');
                    var cow;
                    Resource.map(function(res){
                        cow = res
                    });
                    $httpBackend.flush();
                    cow.color.should.equal(
                        'brown');

                    function namespacingToExistingProperty() {
                        cow.attach(
                            'sleep_schedule')
                    }
                    namespacingToExistingProperty
                        .should.
                    throw (
                        /Path `sleep_schedule` not found from `http:\/\/x.com\/cows\/0001`/
                    )
                })
            });
            describe( 'given namespace on existing property', function() {
                beforeEach(function() {
                    $httpBackend.when('GET', 'http://x.com/cows/0001')
                        .respond(200, {
                            self: 'http://x.com/cows/0001'
                            , element: 'shoji:entity'
                            , specification: 'http://x.com/specifications/cows'
                            , body: {
                                name: 'bessie'
                                , color: 'brown'
                            }
                            , urls: {
                                milk_schedule_url: 'http://x.com/cows/0001/milk_schedule'
                            }
                        }, {
                            ALLOW: 'GET, HEAD, PUT'
                        })
                });
                it('should throw', function() {
                    var cow = null;
                    var Resource = Shoji(
                        'http://x.com/cows/0001');
                    Resource.map().then(function(res){
                        cow = res
                    })
                    $httpBackend.flush();
                    cow.color.should.equal(
                        'brown');

                    function namespacingToExistingProperty() {
                        cow.attach(
                            'milk_schedule', 'color')
                    }
                    namespacingToExistingProperty
                        .should.
                    throw (
                        /Property `color` is already attached to `http:\/\/x.com\/cows\/0001`/
                    )
                })
            });
            describe('given no namespace', function() {
                beforeEach(function() {
                    $httpBackend.when('GET', 'http://x.com/cows/0001')
                        .respond(200, {
                            self: 'http://x.com/cows/0001'
                            , element: 'shoji:entity'
                            , specification: 'http://x.com/specifications/cows'
                            , body: {
                                name: 'bessie'
                                , color: 'brown'
                            }
                            , urls: {
                                milk_schedule_url: 'http://x.com/cows/0001/milk_schedule/'
                            }
                        }, {
                            ALLOW: 'GET, HEAD, PUT'
                        });
                    $httpBackend.expect('GET', 'http://x.com/cows/0001/milk_schedule/?weekdays=true'
                    )
                        .respond(200, {
                            monday: '6AM'
                            , tuesday: '7AM'
                            , wednesday: ''
                            , thursday: '6AM'
                            , friday: ''
                        }, {
                            ALLOW: 'GET'
                        })
                });
                it( 'should namespace resolved resource as url key', function() {
                        var cow = null;
                        var Resource = Shoji(
                            'http://x.com/cows/0001');
                        Resource.map()
                            .then(function(mapped) {
                                cow = mapped;
                                var cfg = {
                                    params: {
                                        weekdays: true
                                    }
                                };
                                cow.attach(
                                    'milk_schedule', null, cfg)
                            });
                        $httpBackend.flush();
                        cow.milk_schedule.value.should
                            .eql({
                                monday: '6AM'
                                , tuesday: '7AM'
                                , wednesday: ''
                                , thursday: '6AM'
                                , friday: ''
                            })
                    })
            })
        });
        describe('when mapping resources', function() {
            beforeEach(function() {
                $httpBackend.when('GET', 'http://x.com/cows')
                    .respond(200, {
                        self: 'http://x.com/cows/'
                        , element: 'shoji:catalog'
                        , specification: 'http://x.com/specifications/cows'
                        , index: {
                            'http://x.com/cows/0001':{}
                            , 'http://x.com/cows/0002':{}
                        }
                    }, {
                        ALLOW: 'GET, HEAD, POST'
                    });
                $httpBackend.when('GET', 'http://x.com/cows/0001')
                    .respond(200, {
                        self: 'http://x.com/cows/0001'
                        , element: 'shoji:entity'
                        , specification: 'http://x.com/specifications/cows'
                        , body: {
                            name: 'bessie'
                            , color: 'brown'
                        }
                        , urls: {
                            horses_url: 'http://x.com/horses/'
                            , donkeys_url: 'http:/x.com/donkeys/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    });
                $httpBackend.when('GET', 'http://x.com/horses/')
                    .respond(200, {
                        self: 'http://x.com/horses/'
                        , element: 'shoji:catalog'
                        , specification: 'http://x.com/specifications/horses'
                        , index: {
                            'http://x.com/horses/0003':{}
                        }
                    }, {
                        ALLOW: 'GET, HEAD, POST'
                    });
                $httpBackend.when('GET', 'http://x.com/horses/0003')
                    .respond(200, {
                        self: 'http://x.com/horses/0003'
                        , element: 'shoji:entity'
                        , specification: 'http://x.com/specifications/horses'
                        , body: {
                            name: 'silver'
                            , color: 'white'
                        }
                        , urls: {
                            goats_url: 'http://x.com/goats/'
                        }
                    }, {
                        ALLOW: 'GET, HEAD, PUT'
                    })
            });
            it('should map to arbitrary result', function( done) {
                var Resource = Shoji(
                    'http://x.com/cows');
                Resource.map(function(cows) {
                    cows.element.should.equal(
                        'shoji:catalog');
                    cows.self.should.equal(
                        'http://x.com/cows/');
                    cows.index.length.should.equal(
                        2);
                    return cows.index['http://x.com/cows/0001'].map(
                        function(cow) {
                            return cow.urls[
                                'horses'].map(
                                function(hs) {
                                    return hs.self
                                })
                        })
                }).then(function(horse) {
                        horse.should.equal(
                            'http://x.com/horses/'
                        );
                        done()
                    });
                $httpBackend.flush()
            });
            it('should map to arbitrary resources', function(done) {
                    var Resource = Shoji(
                        'http://x.com/cows');
                    Resource.map(function(cows) {
                        cows.element.should.equal(
                            'shoji:catalog');
                        cows.self.should.equal(
                            'http://x.com/cows/');
                        cows.index.length.should.equal(
                            2);
                        return cows.index['http://x.com/cows/0001'].map(
                            function(cow) {
                                return cow.urls['horses'].map(
                                    function(hs) {
                                        return hs.index['http://x.com/horses/0003'].map()
                                    })
                            })
                    })
                        .then(function(horse) {
                            horse.name.should.equal(
                                'silver');
                            done()
                        });
                    $httpBackend.flush()
                })
        })
    })
