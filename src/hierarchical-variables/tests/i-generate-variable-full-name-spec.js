'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    ;

describe('iGenerateVariableFullName', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(iGenerateVariableFullName) {
            sut = iGenerateVariableFullName
        })
    }

    describe('when getting the variable full name', function() {
        beforeEach(buildModule)
        beforeEach(buildSut)


        describe('given a first lvl scalar variable', function() {
            var fullName
                ;

            /**
             * First level scalar variables don't have parent, in other words,
             * they are not part of a categorical array and within the groups
             * hierarchy, they don't belong to a nested group.
             */

            beforeEach(function() {
                fullName = sut({
                    name : 'var name'
                    , parent : {
                        name : 'group name'
                    }
                })
            })

            it('should return the variable name', function() {
                fullName.should.be.equal('var name')
            })
        })

        describe('given a scalar variable within a deep hierarchy', function() {
            var fullName
                ;

            beforeEach(function() {
                fullName = sut({
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

            it('should return the variable name along with its n-1 parent names', function() {
                fullName.should.be.equal('lvl 1 - lvl 2 - var name')
            })
        })

        describe('given a scalar variable within a deep hierarchy that includes a graph root node', function() {
            var fullName
                ;

            beforeEach(function() {
                fullName = sut({
                    name : 'var name'
                    , parent : {
                        name : 'lvl 2'
                        , parent : {
                            name : 'lvl 1'
                            , parent : {
                                name : 'lvl 0'
                                , parent : {
                                    name : 'graph'
                                }
                            }
                        }
                    }
                })
            })

            it('should not consider the graph as parent of the hierarchy', function() {
                fullName.should.be.equal('lvl 1 - lvl 2 - var name')
            })
        })

        describe('given a scalar variable within a deep hierarchy that includes a graph root node', function() {
            var fullName
                ;

            beforeEach(function() {
                fullName = sut({
                    name : 'var name'
                    , parent : {
                        name : 'lvl 2'
                        , parent : {
                            name : 'lvl 1'
                            , parent : {
                                name : 'lvl 0'
                                , parent : {
                                    name : 'graph'
                                }
                            }
                        }
                    }
                })
            })

            it('should not consider the graph as parent of the hierarchy', function() {
                fullName.should.be.equal('lvl 1 - lvl 2 - var name')
            })
        })

        describe('given a subvariable (belongs to a categorical array)', function() {
            var fullName
                ;

            beforeEach(function() {
                fullName = sut({
                    name : 'var name'
                    , parent : {
                        name : 'array'
                        , hierarchicalType : 'variable'
                        , parent : {
                            name : 'graph'
                        }
                    }
                })
            })

            it('should always consider the subvariable parent', function() {
                fullName.should.be.equal('array - var name')
            })
        })
    })

})
