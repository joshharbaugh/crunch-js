'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , mockHierarchicalVariables = require('../../test-support/mock-hierarchical-variables')
    , varsFixture = require('../../hierarchical-variables/tests/variables')
    , orderFixture = require('../../hierarchical-variables/tests/hierarchical-grouped')
    ;

describe('VariableList', function() {
    var VariableList
        , datasetId = '/datasets/123'
        , hv
        , catArrayFixture = {
            element : 'shoji:entity'
            , self : '/vars/123'
            , body : {
                type : 'categorical_array'
            }
        }
        , subvariableFixture = {
            element : 'shoji:entity'
            , self : '/var/456'
            , body : {
                name : 'LeadershipObama'
            }
        }
        ;

    function buildModule() {
        var main = mainMod()
            ;

        main.factory('cachedHierarchicalVariables', function($q) {
            var cached = { }
                ;

            hv = mockHierarchicalVariables
                .getHierarchicalVariablesObj(undefined, varsFixture, orderFixture)

            cached.current = hv

            return cached
        })

        mockHierarchicalVariables.registerModule()

        angular.mock.module(main.name)
    }

    function expectGET(url, content) {
        inject(function($httpBackend) {
            $httpBackend.expectGET(url).respond(200, content)
        })
    }

    function flush() {
        angular.mock.inject(function($rootScope, $httpBackend) {
            $rootScope.$digest()
            $httpBackend.flush()
        })
    }


    function buildSut() {
        angular.mock.inject(function (_VariableList_) {
            VariableList = _VariableList_
        })
    }

    describe('when constructing', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = new VariableList(datasetId)
        })

        it('should initialize the items array', function() {
            sut.items.should.not.be.undefined
        })
    })

    describe('when adding a new variable', function() {

        describe('given a variable url', function() {
            var sut
                , addedVariables
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = new VariableList(datasetId)
                expectGET(hv.byId('/economytrend').self, {})
                sut.add('/economytrend').then(function(variables) {
                    addedVariables = variables
                })
                flush()

            })

            it('should add the variable metadata to the items array', function() {
                var variable = sut.items.pop()
                    ;

                expect(variable).to.equal(addedVariables[0])
            })
        })

        describe('given a list of variable urls', function() {
            var sut
                , addedVariables
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = new VariableList(datasetId)
                expectGET(hv.byId('/childrenunder18').self, {})
                expectGET(hv.byId('/economytrend').self, {})

                sut.add(['/childrenunder18', '/economytrend']).then(function(variables) {
                    addedVariables = variables
                })
                flush()
            })

            it('should add the variable metadata to the items array', function() {
                expect(sut.items).to.deep.equal(addedVariables)
            })
        })

        describe('given a categorical array variable', function() {
            var sut
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = new VariableList(datasetId)
                expectGET(hv.byId('leadershipMatrix/').self, catArrayFixture)
                sut.add('leadershipMatrix/')
                flush()

            })

            it('should add the variable twice', function() {
                sut.items.length.should.be.equal(2)
            })

            it('should set the dimension attribute to "variable" in the second copy', function() {
                // this is the *columns*
                sut.items[1].dimension.should.be.equal('variable')
            })

            it('should set the dimension attribute to "each" in the first copy', function() {
                // this is the *rows*
                sut.items[0].dimension.should.be.equal('each')
            })
        })

        describe('given a subvariable', function() {
            var sut
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                var subvar = hv.byId('leadershipobama/')
                    , matrix = hv.byId('leadershipMatrix')
                    ;

                sut = new VariableList(datasetId)


                inject(function($q, Shoji) {
                    matrix.getSubvariables = function () {
                        return $q.when({})
                    }

                    matrix.subvariableById = function () {
                        return {
                            name:  'LeadershipObama'
                            , map: function () {
                                return Shoji(subvar.self).map()
                            }
                        }
                    }
                })

                expectGET(subvar.self, subvariableFixture)
                sut.add('leadershipobama/')
                flush()
            })

            it('should fetch the subvariable metadata and add it to the list', function() {
                expect(sut.items[0].name).to.equal('LeadershipObama')
            })
        })
    })

    describe('when replacing a variable', function() {
        var sut
            , variable
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = new VariableList(datasetId)
            expectGET(hv.byId('/childrenunder18').self, {})
            sut.add('/childrenunder18')
            flush()
            sut.replace(0, '/economytrend').then(function(v) {
                variable = v
            })
            expectGET(hv.byId('/economytrend').self, {})
            flush()
        })

        it('should replace the variable info at the given index with the new variable', function() {
            sut.items[0].self.should.be.equal('/api/datasets/123/variables/economytrend/')
            expect(variable).to.equal(sut.items[0])
        })
    })

    describe('when removing a variable at a given index', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = new VariableList(datasetId)
            expectGET(hv.byId('/economytrend').self, {})
            sut.add('economytrend/')
            flush()
            sut.remove(0)
        })

        it('should remove remove the variable', function() {
            sut.isEmpty().should.be.true
        })
    })

    describe('when pivoting', function() {

        describe('given two variables', function() {
            var sut
                ,var1Id = '/api/datasets/123/variables/economytrend/'
                ,var2Id = '/api/datasets/123/variables/childrenunder18/'
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = new VariableList(datasetId)
                sut.add(var1Id)
                sut.add(var2Id)
                expectGET(hv.byId('/economytrend').self, {})
                expectGET(hv.byId('/childrenunder18').self, {})
                flush()

                sut.pivot(1,0)
            })

            it('should swap variables in index 0 and 1', function() {
                sut.items[1].self.should.be.equal(var1Id)
                sut.items[0].self.should.be.equal(var2Id)
            })
        })
    })

    describe('when looking for array variables', function() {

        describe('given a variable with subvariables', function() {
            var sut
                ;

            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = new VariableList(datasetId)
                expectGET(hv.byId('/leadershipMatrix').self, catArrayFixture)
                sut.add('leadershipMatrix/')
                flush()
            })

            it('should return true', function() {
                sut.hasArrays().should.be.true
            })
        })
    })
})
