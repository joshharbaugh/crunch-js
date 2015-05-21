'use strict'

var mocks = require('angular-mocks')
    , machinaMod = require('../../machina-angular')
    , traversableMod = require('../../traversable')
    , mainMod = require('../index')
    , mockHierarchicalVariables = require('../../test-support/mock-hierarchical-variables')
    ,fixtures = {
        variables: require('../../hierarchical-variables/tests/variables')
        ,hierarchicalUngrouped : require('../../hierarchical-variables/tests/hierarchical-ungrouped')
    }
    , _ = require('lodash')
    ;

describe('HierarchicalGroup', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            , machina = machinaMod()
            , traversable = traversableMod()
            ;

        main.factory('bus', function() {return {}})

        mockHierarchicalVariables.registerModule()

        angular.mock.module(main.name, machina.name, traversable.name)
    }

    function buildSut() {
        angular.mock.inject(function(HierarchicalGroup, hierarchicalBehaviors) {
            var hv = mockHierarchicalVariables.getHierarchicalVariablesObj(
                undefined
                , _.cloneDeep(fixtures.variables)
                , fixtures.hierarchicalUngrouped
            )

            sut = HierarchicalGroup.create({
                group : hv.ordered
                , behaviors : hierarchicalBehaviors.DEFAULT()
            })
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    context('when applying new hierarchical behaviors', function() {

        context('given the hierarchical behaviors are filtering items by their type', function() {
            beforeEach(function() {
                sut.handle('expand')
                inject(function(hierarchicalBehaviors) {
                    sut.applyBehaviors(hierarchicalBehaviors({
                        types : ['numeric']
                    }))
                })
            })

            it('should recalculate the number of pages where items fit', function() {
                expect(sut.incrementable).to.be.false
            })
        })
    })
})