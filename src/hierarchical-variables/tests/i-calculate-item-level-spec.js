'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    ;

describe('iCalculateItemLevel', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(iCalculateItemLevel) {
            sut = iCalculateItemLevel
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when calculating an item level', function() {
        var level

        beforeEach(function() {
            level = sut({
                name : 'var name'
                , parent : {
                    name : 'lvl 2'
                    , parent : {
                        name : 'lvl 1'
                        , parent : {
                            name : 'lvl 0'
                        }
                    }
                }
            })
        })

        it('should count 1 + the number of connections between the node and the root', function() {
            expect(level).to.equal(4)
        })
    })
})
