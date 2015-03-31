var ShojiOfflineDataStrategy = require(
    '../shoji-offline-data-strategy')
    , _ = require('lodash')
    , mocks = require('angular-mocks');
module.exports = (function() {
    'use strict';
    describe.skip('ShojiOfflineDataStrategy', function() {
        var $q;;
        beforeEach(function() {
            $q = moq()
        });
        describe('when loading resource', function() {
            var instance
                , setup
                , cfg
                , Strategy;;
            beforeEach(function() {
                ShojiOfflineDataStrategy.mount({
                    '/api/': {
                        self: '/api/'
                        , name: 'meh'
                    }
                });
                Strategy = new ShojiOfflineDataStrategy
                    .$get(_, $q)
            });
            describe('given any resource', function() {
                var sut;
                beforeEach(function() {
                    sut = new Strategy('/api/')
                });
                it('should support GET requests', function() {
                        var data;
                        sut.get()
                            .then(function(res) {
                                data = res.data
                            });
                        $q.resolveAll();
                        data.name.should.equal('meh')
                    });
                it('should not support saving', function() {
                        sut.get(cfg);
                        $q.resolveAll();

                        function saving() {
                            sut.post()
                        }
                        saving.should.
                        throw (
                            /Writing offline is not supported/
                        )
                    });
                it('should not support updating', function() {
                        sut.get(cfg);

                        function updating() {
                            sut.put()
                                .should.
                            throw (
                                /Writing offline is not supported/
                            )
                        }
                        updating.should.
                        throw (
                            /Writing offline is not supported/
                        );
                        $q.resolveAll()
                    });
                it('should support deleting', function() {
                        sut.get(cfg);
                        sut.delete()
                            .should.not.
                        throw;
                        $q.resolveAll()
                    })
            })
        })
    })
})
    .call(this);