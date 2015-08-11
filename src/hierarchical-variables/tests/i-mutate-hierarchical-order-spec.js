'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , _ = require('lodash')
    , fixtures = {
        hierarchicalGrouped : require('./hierarchical-grouped')
        , variables : require('./variables')
    }
    , mockShoji = require('../../test-support/mock-shoji')
    ;

describe('iMutateHierarchicalOrder', function() {
    var sut
        , iPerformVariableLookup
        ;

    function buildModule() {
        var main = mainMod()
            ;

        mockShoji.registerModule()

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(iMutateHierarchicalOrder, _iPerformVariableLookup_) {
            sut = iMutateHierarchicalOrder
            iPerformVariableLookup = _iPerformVariableLookup_
        })
    }

    function buildHierarchicalOrder() {
        var order
            ;

        angular.mock.inject(function(iBuildHierarchicalOrder, VariableCatalogList) {
            order = iBuildHierarchicalOrder(
                new VariableCatalogList([mockShoji.getShojiObj(_.clone(fixtures.variables, true))])
                , mockShoji.getShojiObj(_.clone(fixtures.hierarchicalGrouped, true))
            )
        })

        return order
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when moving an item into a group', function() {
        var group
            , item
            , groupIndex
            , itemIndex
            , order
            ;

        beforeEach(function() {
            order = buildHierarchicalOrder()

            item = iPerformVariableLookup.byId(order, '/syriamilitaryaction/')
            group = order.ordered.items.filter(function(i) { return i.name === 'aaa' })[0]
            groupIndex = iPerformVariableLookup.indexOf(order, group.id)

            sut.moveItemToGroup(order, item, group)

            itemIndex = iPerformVariableLookup.indexOf(order, item.id)
        })

        it('should add the item to the given group', function() {
            expect(group.containsItem(item)).to.be.true
        })

        it('should set the item parent to the given group', function() {
            expect(item.parent).to.equal(group)
        })

        it('should move the item in the order index one step behind the group', function() {
            expect(itemIndex).to.equal(groupIndex)
        })

        it('should remove the item from the previous group', function() {
            expect(order.ordered.containsItem(item)).to.be.false
        })
    })

    describe('when switching items order', function() {
        var firstItem
            , secondItem
            , firstItemOldIndex
            , secondItemOldIndex
            , order
            ;

        beforeEach(function() {
            order = buildHierarchicalOrder()

            firstItem = iPerformVariableLookup.byId(order, '/percentskipped/')
            firstItemOldIndex = iPerformVariableLookup.indexOf(order, firstItem.id)

            secondItem = iPerformVariableLookup.byId(order, '/directionofcountry/')
            secondItemOldIndex = iPerformVariableLookup.indexOf(order, secondItem.id)

            sut.switchItemsOrder(order, firstItem, secondItem)
        })

        it('should set the first item in the second position in the order', function() {
            expect(iPerformVariableLookup.indexOf(order, firstItem.id)).to.equal(secondItemOldIndex)
            expect(iPerformVariableLookup.indexOf(order, secondItem.id)).to.equal(firstItemOldIndex)
        })
    })

    describe('when moving an item to the position of another', function() {
        var firstItem
            , beforeItem
            , newIndex
            , oldIndex
            , order
            ;

        beforeEach(function() {
            order = buildHierarchicalOrder()

            firstItem = iPerformVariableLookup.byId(order, '/warcrime/')
            beforeItem = iPerformVariableLookup.byId(order, '/obamaapproval/')
            oldIndex = iPerformVariableLookup.indexOf(order, firstItem.id)
            newIndex = iPerformVariableLookup.indexOf(order, beforeItem.id)

            sut.moveItemBefore(order, firstItem, beforeItem)
        })

        it('should put the item in the index previous to the before item', function() {
            expect(iPerformVariableLookup.indexOf(order, firstItem.id)).to.equal(newIndex-1)
        })
    })

    describe('when creating a new group', function() {

        describe('given a group name and a group parent', function() {
            var createdGroup
                , order
                ;

            beforeEach(function() {
                order = buildHierarchicalOrder()
                createdGroup = sut.createGroupWithParent(order, 'new group', order.ordered)
            })

            it('should add the new group to its parent', function() {
                expect(order.ordered.containsItem(createdGroup)).to.be.true
            })

            it('should add the new group at the parent items first position', function() {
                expect(order.ordered.items[0]).to.equal(createdGroup)
            })

            it('should update the hierarchical order indexes to reflect the change', function() {
                expect(order.flattened[1]).to.equal(createdGroup)
                expect(iPerformVariableLookup.byId(order, createdGroup.id)).to.equal(createdGroup)
            })
        })
    })

    describe('when adding an item', function() {

        describe('given that the prepend option is true', function() {
            var order
                , newItem
                , newVariable
                ;

            beforeEach(function() {
                order = buildHierarchicalOrder()
                inject(function(Group) {
                    var nestedGroup = new Group('nested group')
                        ;

                    newVariable = { id : '999' }

                    nestedGroup.addItem(newVariable)
                    newItem = new Group('new item')
                    newItem.addItem(nestedGroup)
                })
                sut.addItem(order, newItem, {
                    prepend : true
                })
            })

            it('should add the item and its children to the order index', function() {
                expect(iPerformVariableLookup.byId(order, newVariable.id)).to.equal(newVariable)
            })

            it('should add the item at the beginning of the index', function() {
                expect(iPerformVariableLookup.indexOf(order, newItem.id)).to.equal(0)
            })
        })
    })

    describe('when removing a variable', function() {
        var order
            , variableToRemove
            , variableParent
            ;

        beforeEach(function() {
            order = buildHierarchicalOrder()
            variableToRemove = iPerformVariableLookup.byId(order, '/bornagain')
            variableParent = variableToRemove.parent
            sut.removeVariable(order, variableToRemove)
        })

        it('should remove the variable from its group', function() {
            expect(variableParent.containsItem(variableToRemove)).to.be.false
        })

        it('should remove the variable from the variable index', function() {
            expect(iPerformVariableLookup.indexOf(order, variableToRemove.id)).to.equal(-1)
        })
    })

    describe('when removing a group', function() {

        describe('given the group is the root node', function() {
            var order
                ;

            beforeEach(function() {
                order = buildHierarchicalOrder()
            })

            it('should throw an Error indicating that the root node can\'t be deleted', function() {
                expect(function() {
                    sut.removeGroup(order, order.ordered)
                }).to.throw('The root node can\'t be deleted')
            })
        })

        describe('given the group is inside the root node', function() {
            var order
                , groupToRemove
                , groupToRemoveIndex
                ;

            beforeEach(function() {
                order = buildHierarchicalOrder()
                groupToRemove = order.ordered.findItemNamed('aaa')
                groupToRemoveIndex = iPerformVariableLookup.indexOf(order, groupToRemove.id)
                sut.removeGroup(order, groupToRemove)
            })

            it('should remove the group from its parent', function() {
                expect(order.ordered.containsItem(groupToRemove)).to.be.false
            })

            it('should add the removed group items to its parent', function() {
                expect(order.ordered.containsItem(groupToRemove.items[0])).to.be.true
            })

            it('should put removed group items in the index where the removed group was stored', function() {
                expect(iPerformVariableLookup.indexOf(order, groupToRemove.items[0].id))
                .to.equal(groupToRemoveIndex)
            })
        })
    })
})
