'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , machinaMod = require('../../machina-angular')
    ;

describe('Analysis', function() {
    var Sut
        , fakeAnalysis
        , datasetId = '/datasets/123'
        ;

    function buildModule() {
        var main = mainMod()
            , machina = machinaMod('machina.test')
            ;

        fakeAnalysis = {
            variables : [
                'var1'
                , 'var2'
            ]
            , results : { count : [] }
            , analysis : { query : { named_args : { variables : ['/var/123'] } } }
        }

        main.factory('analysisGeneratorFactory', function($q) {
            return {
                getGenerator : function() {
                    return function() {
                        return $q.when(fakeAnalysis)
                    }
                }
            }
        })

        main.factory('cachedHierarchicalVariables', function($q) {
            return {
                current : {
                    byId : function(id) {
                        return {
                            self : id
                            , contains : angular.noop
                            , map : function() {
                                return $q.when(this)
                            }
                        }
                    }
                }
            }
        })

        angular.mock.module(main.name, machina.name)

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

    describe('when initializing', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)

        describe('given no parameters', function() {
            beforeEach(function() {
                sut = Sut.create({ datasetId : datasetId })
                flush()
            })

            it('should transition to empty', function() {
                sut.state.should.be.equal('empty')
            })
        })

        describe('given an slide id', function() {
            var triggered
                ;

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
    })

    describe('when loading a saved analysis', function() {
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

    describe('when adding a variable', function() {
        var sut
            , triggered
            ;

        beforeEach(buildModule)
        beforeEach(buildSut)
        beforeEach(function() {
            fakeAnalysis.variables.length = 0
            fakeAnalysis.variables.push('/variable/123')
            sut = Sut.create({ datasetId : datasetId })
            sut.on('analysis.loaded', function() {
                triggered = true
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
            triggered.should.be.true
        })
    })

    describe('when replacing a variable', function() {
        var sut
            ;

        describe('given an analysis variable in the given index', function() {
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

    describe('when cleaning', function() {
        var sut
            ;

        describe('given an analysis with two variables', function() {
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

    describe('when removing a variable in the given index', function() {
        var sut
            ;

        describe('given an analysis with two variables', function() {
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

        describe('given an analysis with one variable', function() {
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

    describe('when analysis calculation fails', function() {
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
})
