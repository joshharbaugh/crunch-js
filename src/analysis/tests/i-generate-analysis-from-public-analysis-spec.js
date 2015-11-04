'use strict'

var  mainMod = require('../index')
    , shojiMod = require('../../shoji')
    , cubeMod = require('../../cube')
    , publicAnalysisFixture = require('./external-resource-analysis-fixture.json')

describe('iGenerateAnalysisFromPublicAnalysis', function() {
    var sut
        ;

    function buildModule() {
        var mod = mainMod()
            , shoji = shojiMod('shoji.test')
            , cube = cubeMod('cube.test')
            ;

        angular.mock.module(mod.name, shoji.name, cube.name)
    }

    function buildSut() {
        angular.mock.inject(function(iGenerateAnalysisFromPublicAnalysis) {
            sut = iGenerateAnalysisFromPublicAnalysis
        })
    }

    function expectGET(url, result) {
        angular.mock.inject(function($httpBackend) {
            $httpBackend.expectGET(url).respond(200, result)
        })
    }

    function flush() {
        angular.mock.inject(function($httpBackend, $rootScope) {
            $rootScope.$digest()
            $httpBackend.flush()
            $httpBackend.verifyNoOutstandingExpectation()
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when checking if the generator accepts an analysis request', function() {

        context('given the parameters object contains an externalResource attribute', function() {

            it('should accept the analysis request', function() {
                expect(sut.accepts({ publicAnalysisURL : '/public/analysis' })).to.be.true
            })
        })
    })

    describe('when generating an analysis from a public resource', function() {
        var results

        beforeEach(function() {
            expectGET(publicAnalysisFixture.self, publicAnalysisFixture)
            sut({ publicAnalysisURL : publicAnalysisFixture.self }).then(function(r) {
                results = r
            })
            flush()
        })

        it('should return a results object containing a list of variables', function() {
            expect(results.variables[0]).to.deep.contain({
                "self" : "https://my/variable/1/"
                , "element": "shoji:entity"
            })
            expect(results.variables[1]).to.deep.contain({
                "self" : "https://my/variable/3/"
                , "element": "shoji:entity"
            })
            expect(results.variables[2]).to.deep.contain({
                "self" : "https://my/variable/4/"
                , "element": "shoji:entity"
                , "dimension" : "each"
            })
        })

        it('should return a results object containing a list of variables', function() {
            expect(results.measureVariables[0].type).to.deep.contain('mean')
            expect(results.measureVariables[0].variable).to.deep.contain({
                "self" : "https://my/variable/2/"
                , "element" : "shoji:entity"
            })
        })

        it('should create a cube object from the results array', function() {
            inject(function(cube) {
                expect(results.cube instanceof cube).to.be.true
            })
        })

        it('should create a filters property with a list of filter entities applied', function() {
            expect(results.filters[0]).to.deep.contain({
                element : "shoji:entity"
                , self : "https://my/filter/"
            })
        })
    })
})
