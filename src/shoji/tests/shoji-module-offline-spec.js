var shoji = require('../index');
module.exports = (function() {
    'use strict';
    describe.skip('shoji module offline', function() {
        function getData() {
            var catalog1 = {
                element: 'shoji:catalog'
                , self: '/catalogs/'
                , entities: ['/catalogs/456/', '/catalogs/567/']
            };
            var entity1 = {
                element: 'shoji:entity'
                , self: '/catalogs/456/'
                , body: {
                    name: 'mike'
                    , age: 43
                }
                , urls: {
                    levels: '/levels/'
                }
            };
            var catalog2 = {
                element: 'shoji:catalog'
                , self: '/levels/'
                , entities: ['/levels/1/', '/levels/2/']
            };
            var entity2 = {
                element: 'shoji:entity'
                , self: '/levels/1/'
                , body: {
                    name: 'level1'
                }
                , urls: {}
            };
            var entity3 = {
                element: 'shoji:entity'
                , self: '/levels/2/'
                , body: {
                    name: 'level2'
                }
                , urls: {}
            };
            return {
                '/catalogs/': catalog1
                ,'/catalogs/456/': entity1
                ,'/levels/': catalog2
                ,'/levels/1/': entity2
                ,'/levels/2/': entity3
            }
        }
        beforeEach(function() {
            var data = getData();
            var mod = shoji('shoji.offline', {
                cacheable: false
                , offline: true
            });
            mod.config(['shojiDataStrategyProvider', function(DataStrategy) {
                    DataStrategy.mount(data)
                }
            ])
        });
        beforeEach(angular.mock.module('shoji.offline'));
        describe('catalog entities', function() {
            it('should be navigable', function(done) {
                inject(function($rootScope, Shoji) {
                    var Catalog1 = Shoji(
                        '/catalogs/');
                    expect(Catalog1.entities)
                        .not.to.exist;
                    Catalog1.map(function(cat) {
                        cat.entities.length.should
                            .equal(2);
                        cat.entities[0].map(
                            function(ent) {
                                ent.self.should
                                    .equal(
                                        '/catalogs/456/'
                                );
                                ent.name.should
                                    .equal(
                                        'mike'
                                );
                                ent.urls.levels
                                    .map(
                                        function(
                                            cat
                                        ) {
                                            cat
                                                .self
                                                .should
                                                .equal(
                                                    '/levels/'
                                            );
                                            cat
                                                .entities[
                                                    0
                                            ]
                                                .map(
                                                    function(
                                                        lvl1
                                                    ) {
                                                        lvl1
                                                            .name
                                                            .should
                                                            .equal(
                                                                'level1'
                                                        );
                                                        done()
                                                    }
                                            )
                                        })
                            })
                    });
                    $rootScope.$digest()
                })
            })
        })
    })
})
    .call(this);