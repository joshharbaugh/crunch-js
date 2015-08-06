'use strict';


var mainModule = require('../index')
    , mocks = require('angular-mocks')
    , mockShoji = require('../../test-support/mock-shoji')
    , _ = require('lodash')
    ,fixtures = {
        variables: require('./variables')
        ,hierarchicalUngrouped : require('./hierarchical-ungrouped')
        ,hierarchicalGrouped: require('./hierarchical-grouped')
        ,hierarchicalSearch: require('./hierarchical-search')
        ,hierarchicalNestedGroups: require('./hierarchical-nested-groups')
        ,hierarchicalGroupedSmall : require('./hierarchical-grouped-small')
        ,dataset: require('./dataset')
        ,emptyJoins: require('./empty-joins')
        ,joins: require('./joins')
        ,hierarchicalSubordinate : require('./hierarchical-subordinate')
        ,hierarchicalSubordinateDuplicateIds : require('./hierarchical-subordinate-duplicate-ids')
        ,subordinateVariables : require('./subordinate-variables')
    }
    ;

describe('HierarchicalVariables',function(){
    var getShojiObj = mockShoji.getShojiObj
        ;

    function buildModule() {
        var main = mainModule()
            ;

        main.factory('iFetchSubvariables', function() {
            return {}
        })

        mockShoji.registerModule()
        angular.mock.module(main.name)

        return main
    }

    function buildSut(catalogs, order) {
        var sut
            ;

        angular.mock.inject(function(HierarchicalVariables, VariableCatalogList) {
            sut = new HierarchicalVariables(
                new VariableCatalogList(catalogs.map(getShojiObj))
                , getShojiObj(order)
            )
        })

        return sut
    }

    function variablesFixture() {
        return _.cloneDeep(fixtures.variables)
    }

    function subordinateVariablesFixture() {
        return _.cloneDeep(fixtures.subordinateVariables)
    }

    function fakeUniqueId() {
        angular.mock.inject(function(lodash) {
            lodash._uniqueId = lodash.uniqueId
            lodash.uniqueId = function(prefix) {
                return prefix + '123'
            }
        })
    }

    function restoreUniqueId() {
        angular.mock.inject(function(lodash) {
            lodash.uniqueId = lodash._uniqueId
        })
    }

    describe('when getting a variable index', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(function() {
            sut = buildSut([variablesFixture(), fixtures.subordinateVariables]
                    , _.clone(fixtures.hierarchicalGrouped, true))
        })

        it('return the index related with the variable id', function() {
            expect(sut.indexOf('percentskipped')).to.equal(1)
        })
    })

    describe('when fetched for a grouped dataset',function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(function(){
            sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalGrouped, true))
        })

        it('should expose relevant order url',function(){
            sut.orderId.should.equal(fixtures.hierarchicalGrouped.self)
        })

        it('should exposed ordered groups',function(){
            sut.ordered.containsItemNamed('aaa')
        })

        it('should assign each variable to its group',function(){
            var group = sut.ordered.items[0]
            group.items[1].alias.should.equal('politicalinterest')
        })

        it('should support flattening',function(){
            var flattened = sut.flatten()
            //only count variables
            var all = fixtures.hierarchicalGrouped.graph
            flattened.length.should.equal(all.length + all[0].aaa.length)
            flattened[1].parent.name.should.equal('aaa')
            flattened[1].alias.should.equal('percentskipped')
            flattened[2].parent.name.should.equal('aaa')
            flattened[2].alias.should.equal('politicalinterest')
            flattened[3].parent.name.should.equal('aaa')
            flattened[3].alias.should.equal('directionofcountry')
            flattened[flattened.length-1].parent.name.should.equal('graph')
            flattened[flattened.length-1].alias.should.equal('age4')
        })
    })

    describe('when fetched for an ungrouped dataset',function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(function() {
            sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalUngrouped, true))
        })

        it('should add all ungrouped variables to the graph group',function(){
            var unorderedItems = fixtures.hierarchicalUngrouped.graph //ungrouped variables
            sut.ordered.itemsCount.should.equal(unorderedItems.length)
            sut.ordered.items[0].parent.name.should.equal('graph')
            sut.ordered.items[unorderedItems.length-1].parent.name.should.equal('graph')
        })

        it('should assign each variable to its group',function(){
            var group = fixtures.hierarchicalUngrouped.graph
            sut.ordered.items.length.should.equal(group.length)
            sut.ordered.items[2].alias.should.equal('politicalinterest')
        })
    })

    describe('when fetched for a nested groups dataset',function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(function() {
            sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalNestedGroups, true))
        })

        it('should expose nested groups', function() {
            var groupWithNestedGroups = sut.ordered.items[1]
                , nestedGroup = groupWithNestedGroups.items[9] //see hierarchical-nested-group.json
                ;

            nestedGroup.constructor.name.should.be.equal('Group')
            nestedGroup.name.should.be.equal('Obama')
        })

        it('should fill nested group with its entities', function() {
            var groupWithNestedGroups = sut.ordered.items[1]
                , nestedGroup = groupWithNestedGroups.items[9] //see hierarchical-nested-group.json
                , nestedGroupFixture = fixtures.hierarchicalNestedGroups.graph[1].BB[9].Obama
                ;

            nestedGroup.items.length.should.be.equal(nestedGroupFixture.length)
        })

        it('should include the nested group and its items in the flattened hierarchical variables', function() {
            var flattened = sut.flatten()
                ;

            //should include a variable only available in the nested group
            flattened.some(function(item) {
                return item.self === "/api/datasets/123/variables/obamaapprovalsyria/"
            }).should.be.true
        })
    })

    describe.only('When fetched for a nested group with a variable in both', function(){
        /*
        * This scenario contains one variable present in two nested groups.
        * The original bug was that the variable-catalogs-list would only
        *
        * */
        var sut;
        beforeEach(buildModule)
        beforeEach(function() {
            sut = buildSut([{
               "element":"shoji:catalog",
               "self":"/api/datasets/123/joins/456/variables/",
               "specification":"/api/specifications/variables/",
               "description":"List of Variables of this dataset",
               "index":{
                  "myvar/":{
                     "name":"Var1",
                     "discarded":false,
                     "alias":"economytrend",
                     "is_subvar":null,
                     "type":"categorical",
                     "id":"economytrend",
                     "description":"Overall, do you think the economy is getting better or worse?"
                  }
                  ,"myvar2/":{
                     "name":"Var2",
                     "discarded":false,
                     "alias":"economytrend",
                     "is_subvar":null,
                     "type":"categorical",
                     "id":"economytrend",
                     "description":"Overall, do you think the economy is getting better or worse?"
                  }
               },
               "views":{
                  "hierarchical_order":"/api/datasets/123/variables/hierarchical/"
               }
            }], _.clone({
               "element":"shoji:order",
               "self":"/api/datasets/123/variables/hier/",
               "description":"Hierarchical ordering of dataset variables",
               "graph": [
                  {
                      "parent": [{
                         "A" : [
                            "../myvar/"
                         ]},{
                         "B" : [
                            "../myvar/"
                            ,"../myvar2/"
                         ]
                      }]
                  }
               ]
            }, true))
        })
        it('should put the variable in both groups', function() {
            sut.order.ordered.items[0].items[0].name.should.equal('A')
            sut.order.ordered.items[0].items[1].name.should.equal('B')
            sut.order.ordered.items[0].items[0].items[0].data.name.should.equal('Var1')
            sut.order.ordered.items[0].items[1].items[0].data.name.should.equal('Var1')

        })
    })

    describe('when fetched for a subordinate dataset (joins)', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(function() {
            sut = buildSut([fixtures.subordinateVariables], _.clone(fixtures.hierarchicalSubordinate, true))
        })

        it('should mark subordinate variables as "subordinate"', function() {
            sut.flatten()[1].subordinate.should.be.true
        })
    })

    describe('when getting a subvariable by id', function() {
        var sut
            ;

        describe('given composite variables', function() {
            beforeEach(buildModule)
            beforeEach(fakeUniqueId)
            beforeEach(function() {
                sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalNestedGroups, true))
            })
            afterEach(restoreUniqueId)

            it('should return the subvariable parent', function() {
                expect(sut.byId('leadershipclinton').name).to.equal('Leadership array')
            })
        })
    })

    describe('when getting a group by id', function() {
        var sut
            ;

        describe('given a hierarchical order with nested groups', function() {
            beforeEach(buildModule)
            beforeEach(fakeUniqueId)
            beforeEach(function() {
                sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalNestedGroups, true))
            })
            afterEach(restoreUniqueId)

            it('should find the group object', function() {
                sut.byId('Obama123').should.be.ok
            })
        })
    })

    describe('when getting an item by name', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(function() {
            sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalGrouped, true))
        })

        it('should return the first item that matches the given name', function() {
            expect(sut.byName('Leadership array').name).to.equal('Leadership array')
        })
    })

    describe('when getting the first variable in the hierarchy', function() {
        var sut
            ;

        beforeEach(buildModule)
        beforeEach(function() {
            sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalNestedGroups, true))
        })

        it('should return a variable type item', function() {
            expect(sut.firstVariable().hierarchicalType).to.equal('variable')
        })
    })

    describe('given a variable in the catalog but not the order', function(){
        var sut
        ;

        beforeEach(function() {
            buildModule()
            // remove the weight from the order
            var orderWithoutWeight = _.clone(fixtures.hierarchicalGrouped, true)
            var o = orderWithoutWeight.graph[0].aaa
            orderWithoutWeight.graph[0].aaa = o.splice(o.indexOf('../weight/'), 1)
            sut = buildSut([variablesFixture(), fixtures.subordinateVariables], orderWithoutWeight)
        })

        it('should be undefined in byId', function() {
            expect(sut.byId('weight/')).to.equal(undefined)
        })
        it('should be found in fromCatalog', function(){
            sut.fromCatalog('weight/').name.should.equal('Weight')
        })
    })

    describe('when generating a shoji order from a hierarchical order object', function() {
        var sut
            ;

        beforeEach(function() {
            buildModule()
            // remove the weight from the order
            sut = buildSut([variablesFixture()], _.clone(fixtures.hierarchicalGroupedSmall, true))
        })

        it('should generate a valid structure with abs urls', function() {
            var serialized = sut.ordered.toJSON()
                ;

            expect(serialized.graph.length).to.equal(fixtures.hierarchicalGroupedSmall.graph.length)
            expect(serialized.graph[0].aaa.length)
            .to.equal(fixtures.hierarchicalGroupedSmall.graph[0].aaa.length)
            expect(typeof serialized.graph[1]).to.equal('string')
        })
    })

    describe('when variables in a main and subordinate datasets have the same id', function() {
        var sut
            ;

        beforeEach(function() {
            buildModule()
            sut = buildSut([
                variablesFixture()
                , subordinateVariablesFixture()
            ], _.clone(fixtures.hierarchicalSubordinateDuplicateIds, true))
        })

        it('should distinguish between variables in different datasets', function() {
            expect(sut.byId('/joins/456/variables/economytrend/').subordinate).to.be.true
            expect(sut.byId('/joins/456/variables/economytrend/').subordinateDataset).to.equal('456')
            expect(sut.byId('/variables/economytrend/').subordinate).to.be.false
            expect(sut.byId('/variables/economytrend/').subordinateDataset).to.equal(null)
        })
    })
})
