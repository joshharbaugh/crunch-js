'use strict';

var mainMod = require('../index')
    ,mocks =require('angular-mocks')
    ,machinaMod = require('../../machina-angular')
    ,mockHierarchicalVariables = require('../../test-support/mock-hierarchical-variables')
    ,mockBus = require('../../test-support/mock-bus')
    ,traversableMod = require('../../traversable/index')
    ,variablesFixture = require('../../hierarchical-variables/tests/variables')
    ,orderFixture = require('../../hierarchical-variables/tests/hierarchical-ungrouped')
    ,orderFixture2  = require('../../hierarchical-variables/tests/hierarchical-grouped')
    ;

describe('HierarchicalVariablesList',function(){
    var sut
        , hv
        ;

    function buildModule() {
        var main = mainMod()
            , machina = machinaMod()
            , traversable = traversableMod()
            ;

        main.factory('bus', function() {
            return mockBus()
        })

        mockHierarchicalVariables.registerModule()
        angular.mock.module(main.name, machina.name, traversable.name)
    }

    function buildSut() {
        angular.mock.inject(function(HierarchicalVariablesList) {
            hv = mockHierarchicalVariables.getHierarchicalVariablesObj(undefined, [variablesFixture], orderFixture)

            sut = HierarchicalVariablesList.create({
                hierarchicalVariables : hv
            })
        })
    }

    beforeEach(buildModule)

    describe('when initializing', function() {

        beforeEach(buildSut)

        it('should create a root hierarchical group', function() {
            expect(sut.root.name).to.equal(hv.ordered.name)
        })
    })


    describe('when refreshing', function() {
        var previous
            ;

        beforeEach(buildSut)
        beforeEach(function() {
            var newOrder = mockHierarchicalVariables.getHierarchicalVariablesObj(undefined
                , [variablesFixture]
                , orderFixture2)


            previous = sut.root
            sut.root.handle('expand')
            expect(sut.root.items[0].name).to.equal('CaseID')
            sut.handle('refresh', newOrder)
        })

        it('should repopulate the list with the new hierarchical order', function() {
            expect(sut.root.items[0].name).to.equal('aaa')
        })

        it('should store the previous root to allow rollbacking', function() {
            expect(previous).to.equal(sut.original)
        })
    })

    describe('when rollbacking', function() {
        var previous
            , refreshed
            ;

        beforeEach(buildSut)
        beforeEach(function() {
            var newOrder = mockHierarchicalVariables.getHierarchicalVariablesObj(undefined
                , [variablesFixture]
                , orderFixture2)
            ;

            sut.on('hvl.refreshed', function() {
                refreshed = true
            })

            previous = sut.root
            sut.handle('refresh', newOrder)
            sut.handle('rollback')
        })

        it('should set the root to the previous one before refreshing', function() {
            expect(sut.root).to.equal(previous)
        })

        it('should publish hvl.refreshed event', function() {
            expect(refreshed).to.be.true
        })
    })
})
