'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    ;

describe('subvariablesCatalogList', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut(catalogs) {
        angular.mock.inject(function(SubvariablesCatalogList) {
            sut = new SubvariablesCatalogList(catalogs)
        })
    }

    beforeEach(buildModule)

    describe('when getting a variable id', function() {

        describe('given the variable exists', function() {
            var variableFound
                ;

            beforeEach(function() {
                buildSut([
                    {
                        index : {
                            keys : ['/a']
                            , '/a' : { }
                        }
                    }
                ])

                variableFound = sut.getVariable('/a')
            })

            it('should return the variable tuple', function() {
                expect(variableFound).to.be.ok
            })
        })
    })

})
