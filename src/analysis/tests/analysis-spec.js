'use strict'

require('angular-mocks')

var mainMod = require('../index')
    , machinaMod = require('../../machina-angular')
    , shojiMod = require('../../shoji')
    , cubeMod = require('../../cube')
    , publicAnalysisFixture = require('./external-resource-analysis-fixture.json')
    ;

describe('Analysis', function() {
    var Sut
        , fakeAnalysis
        , fakeHierarchicalVariables
        , datasetId = '/datasets/123'
        ;

    function buildModule() {
        var main = mainMod()
            , machina = machinaMod('machina.test')
            , shoji = shojiMod()
            , cube = cubeMod()
            ;

        fakeAnalysis = {
            variables : [
                'var1'
                , 'var2'
            ]
            , results : { count : [] }
            , analysis : { query : { named_args : { variables : ['/var/123'] } } }
        }

        main.factory('analysisGeneratorFactory', function($q, iGenerateAnalysisFromPublicAnalysis) {
            return {
                getGenerator : function(params) {
                    if(params.publicAnalysisURL) {
                        //use the real generator to test integration
                        return function() {
                            return iGenerateAnalysisFromPublicAnalysis(params)
                        }
                    } else {
                        return function() {
                            return $q.when(fakeAnalysis)
                        }
                    }
                }
            }
        })

        main.factory('cachedHierarchicalVariables', function($q) {
            return (fakeHierarchicalVariables = {
                current : {
                    defaultType : 'categorical'
                    , byId : function(id) {
                        return {
                            self : id
                            , contains : angular.noop
                            , type : this.defaultType
                            , clone : function() {
                                return this
                            }
                            , map : function() {
                                return $q.when(this)
                            }
                        }
                    }

                    , setVariableType : function(type) {
                        this.defaultType = type
                    }
                }
            })
        })

        angular.mock.module(main.name, machina.name, shoji.name, cube.name)

        return main
    }

    function buildSut() {
        angular.mock.inject(function(Analysis) {
            Sut = Analysis
        })
    }

    function flush() {
        angular.mock.inject(function($rootScope) {
            $rootScope.$digest()
        })
    }

    function expectGET(url, result) {
        angular.mock.inject(function($httpBackend) {
            $httpBackend.expectGET(url).respond(200, result)
        })
    }

    function httpFlush() {
        angular.mock.inject(function($httpBackend, $rootScope) {
            $rootScope.$digest()
            $httpBackend.flush()
            $httpBackend.verifyNoOutstandingExpectation()
        })
    }

    context('when initializing', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)

        context('given no parameters', function() {
            beforeEach(function() {
                sut = Sut.create({ datasetId : datasetId })
                flush()
            })

            it('should transition to empty', function() {
                sut.state.should.be.equal('empty')
            })
        })

        context('given an slide id', function() {
            beforeEach(function() {
                sut = Sut.create({
                    datasetId : datasetId
                    , slideId : '/slide/123'
                })
                flush()
            })

            it('should set the slideId property', function() {
                sut.slideId.should.be.equal('/slide/123')
            })

            it('should transition to empty state', function() {
                sut.state.should.be.equal('empty')
            })
        })

        context('given a publicAnalysisURL', function() {
            beforeEach(function() {
                sut = Sut.create({
                    publicAnalysisURL : '/slide/123'
                })
                flush()
            })

            it('should set the publicAnalysisURL property', function() {
                expect(sut.publicAnalysisURL).to.be.equal('/slide/123')
            })

            it('should transition to empty state', function() {
                expect(sut.state).to.be.equal('empty')
            })
        })
    })

    context('when loading a saved analysis', function() {
        var sut
            , triggered
            , changedTriggered
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = Sut.create({
                datasetId : datasetId
                , slideId : '/slide/123'
            })

            sut.on('savedAnalysis.loaded', function() {
                triggered = true
            })

            sut.on('analysis.loaded', function() {
                changedTriggered = true
            })

            sut.handle('load')
            flush()
        })

        it('should initialize the variables from the existing analysis', function() {
            expect(sut.variables).to.have.deep.property('items[0].self', 'var1')
            expect(sut.variables).to.have.deep.property('items[1].self', 'var2')
            expect(sut.variables).to.have.deep.property('items[0].dimension', 'variable')
            expect(sut.variables).to.have.deep.property('items[1].dimension', 'variable')
        })

        it('should transition to loaded state', function() {
            sut.priorState.should.be.equal('loading')
            sut.state.should.be.equal('loaded')
        })

        it('should emit savedAnalysis.loaded event', function() {
            expect(triggered).to.be.true
        })

        it('should emit analysis.loaded event', function() {
            expect(changedTriggered).to.be.true
        })
    })

    context('when loading a public analysis', function() {
        var sut
            , triggered
            , changedTriggered
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = Sut.create({
                publicAnalysisURL : publicAnalysisFixture.self
            })

            sut.on('savedAnalysis.loaded', function() {
                triggered = true
            })

            sut.on('analysis.loaded', function() {
                changedTriggered = true
            })

            expectGET(publicAnalysisFixture.self, publicAnalysisFixture)
            sut.handle('load')
            httpFlush()
        })

        it('should initialize the variables from the existing analysis', function() {
            expect(sut.variables.count()).to.equal(publicAnalysisFixture.value.queries[0].variables.length)
        })

        it('should transition to loaded state', function() {
            sut.priorState.should.be.equal('loading')
            sut.state.should.be.equal('loaded')
        })

        it('should emit savedAnalysis.loaded event', function() {
            expect(triggered).to.be.true
        })

        it('should emit analysis.loaded event', function() {
            expect(changedTriggered).to.be.true
        })
    })

    context('when adding a variable', function() {
        var sut
            , recalculated
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            fakeAnalysis.variables.length = 0
            fakeAnalysis.variables.push('/variable/123')
            sut = Sut.create({ datasetId : datasetId })
            sut.on('analysis.loaded', function() {
                recalculated = true
            })
            flush()

        })
        beforeEach(function() {
            sut.handle('add-variable', '/variable/123')
            flush()
        })

        it('should add the variable to the end of the variables list', function() {
            sut.variables.items.pop().should.contain({ self : '/variable/123' })
        })

        it('should recalculate the analysis data', function() {
            expect(recalculated).to.be.true
        })
    })

    context('when replacing a variable', function() {
        var sut
            ;

        context('given an analysis variable in the given index', function() {
            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = Sut.create({ datasetId : datasetId })
                sut.handle('add-variable', '/variable/123')
                flush()
            })
            beforeEach(function() {
                sut.handle('replace-variable', 0, '/variable/456')
                flush()
            })

            it('should replace variable in the index with the new variable', function() {
                sut.variables.items[0].self.should.be.equal('/variable/456')
            })
        })
    })

    context('when cleaning', function() {
        var sut
            ;

        context('given an analysis with two variables', function() {
            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = Sut.create({ datasetId : datasetId })
                sut.handle('add-variable', '/variable/123')
                sut.handle('add-variable', '/variable/456')
                flush()
            })
            beforeEach(function() {
                sut.handle('clean')
                flush()
            })

            it('should remove all variables from the analysis', function() {
                sut.variables.items.length.should.be.equal(0)
            })

            it('should transition to empty', function() {
                sut.state.should.be.equal('empty')
            })

            it('should clear previous data', function() {
                expect(sut.data).to.not.be.ok
            })
        })
    })

    context('when removing a variable in the given index', function() {
        var sut
            ;

        context('given an analysis with two variables', function() {
            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = Sut.create({ datasetId : datasetId })
                sut.handle('add-variable', '/variable/123')
                sut.handle('add-variable', '/variable/456')
                flush()
            })

            beforeEach(function() {
                sut.handle('remove-variable', 1)
                flush()
            })

            it('should remove the variable from the variable', function() {
                sut.variables.items.length.should.be.equal(1)
            })
        })

        context('given an analysis with one variable', function() {
            beforeEach(buildModule)
            beforeEach(buildSut)
            beforeEach(function() {
                sut = Sut.create({ datasetId : datasetId })
                sut.handle('add-variable', '/variable/123')
                flush()
            })

            beforeEach(function() {
                sut.handle('remove-variable', 0)
                flush()
            })

            it('should transition to empty', function() {
                sut.state.should.be.equal('empty')
            })

            it('should clear previous data', function() {
                expect(sut.data).to.not.be.ok
            })
        })
    })

    context('when analysis calculation fails', function() {
        var sut
            , triggered
            ;

        beforeEach(function() {
            var main = buildModule()

            //modify generator to return a rejected promise
            main.factory('analysisGeneratorFactory', function($q) {
                return {
                    getGenerator : function() {
                        return function() { return $q.reject('generation error') }
                    }
                }
            })
        })
        beforeEach(buildSut)
        beforeEach(function() {
            sut = Sut.create({ datasetId : datasetId })
            sut.on('analysis.error', function() { triggered = true })
            sut.handle('add-variable', '/var/123')
            flush()
        })

        it('should transition to error state', function() {
            sut.state.should.be.equal('error')
        })

        it('should trigger analysis.error event', function() {
            triggered.should.be.true
        })
    })

    describe('categoricalArray property', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = Sut.create({ datasetId : datasetId })
            fakeHierarchicalVariables.current.setVariableType('categorical_array')
            sut.handle('add-variable', '/var/123')
            flush()
        })

        it('should return a categorical array contained in the variable list', function() {
            expect(sut.categoricalArray.self).to.equal('/var/123')
        })
    })

    describe('scalarVariable property', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = Sut.create({ datasetId : datasetId })
            fakeHierarchicalVariables.current.setVariableType('categorical')
            sut.handle('add-variable', '/var/456')
            flush()
            fakeHierarchicalVariables.current.setVariableType('categorical_array')
            sut.handle('add-variable', '/var/123')
            flush()
        })

        it('should return a variable that is not an array contained in the variable list', function() {
            expect(sut.scalarVariable.self).to.equal('/var/456')
        })
    })

    describe('topMostVariable property', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            sut = Sut.create({ datasetId : datasetId })
        })

        context('given a variable list with 1 variable', function() {
            beforeEach(function() {
                fakeHierarchicalVariables.current.setVariableType('categorical')
                sut.handle('add-variable', '/var/456')
                flush()
            })

            it('should return variable at index 0', function() {
                expect(sut.topMostVariable.self).to.equal('/var/456')
            })

        })

        context('given a variable list with 2 variables', function() {
            beforeEach(function() {
                fakeHierarchicalVariables.current.setVariableType('numeric')
                sut.handle('add-variable', '/var/456')
                flush()
                sut.handle('add-variable', '/var/123')
                flush()
            })

            it('should return variable at index 1', function() {
                expect(sut.topMostVariable.self).to.equal('/var/123')
            })
        })

        context('given a variable list with 3 variables', function() {
            beforeEach(function() {
                fakeHierarchicalVariables.current.setVariableType('numeric')
                sut.handle('add-variable', '/var/456')
                flush()
                sut.handle('add-variable', '/var/123')
                flush()
                sut.handle('add-variable', '/var/789')
                flush()
            })

            it('should return variable at index 0', function() {
                expect(sut.topMostVariable.self).to.equal('/var/456')
            })
        })
    })
})
