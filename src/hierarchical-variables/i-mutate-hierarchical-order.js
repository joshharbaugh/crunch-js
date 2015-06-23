'use strict'

module.exports = IMutateHierarchicalOrderFactory

function IMutateHierarchicalOrderFactory(iPerformVariableLookup, iGetVariableHash, Group, Map) {

    function IMutateHierarchicalOrder() {

    }

    function rebuildOrderIdMapFromFlattenedIndex(flattenedIndex) {
        var orderIdMap = new Map()
            ;

        flattenedIndex.forEach(function(item, index) {
            var previousItems
                ;

            if(orderIdMap.has(item.id)) {
                previousItems = orderIdMap.get(item.id)
                //save different indexes for the same id in a map
                previousItems = typeof previousItems === 'number' ?
                { 'main' : previousItems } :
                    previousItems
                previousItems[item.subordinateDataset] = index
                orderIdMap.set(item.id, previousItems)
            } else {
                orderIdMap.set(item.id, index)
            }

            if(item.hierarchicalType === 'variable') {
                item.subvariables.forEach(function(subvar) {
                    var subvarId = typeof subvar === 'string' ?
                        iGetVariableHash(subvar).replace('/', '') :
                        subvar.id
                        ;

                    orderIdMap.set(subvarId, index)
                })
            }
        })

        return orderIdMap
    }

    IMutateHierarchicalOrder.prototype.moveItemToGroup = function(order, item, group) {
        var groupIndex
            , itemIndex = iPerformVariableLookup.indexOf(order, item.id)
            ;

        groupIndex = (group === order.ordered) ? 0 :  iPerformVariableLookup.indexOf(order, group.id)

        if(groupIndex === -1) {
            throw new Error('This group does not belong to the hierarchical order')
        }

        if(itemIndex === -1) {
            throw new Error('This item does not belong to the hierarchical order')
        }

        if(item && !group.containsItem(item)) {
            if(item.parent) {
                item.parent.removeItem(item)
            }

            group.addItem(item)
            item.parent = group
            order.flattened.splice(itemIndex, 1)
            order.flattened.splice(groupIndex, 0, item)
            order.orderedIndex = rebuildOrderIdMapFromFlattenedIndex(order.flattened)
        }
    }

    function flat(item) {

        function flatRecurr(item, collection) {
            var children = item.items || []
                ;

            collection.push(item)
            children.forEach(function(child) {
                flatRecurr(child, collection)
            })

            return collection
        }

        return flatRecurr(item, [])
    }

    IMutateHierarchicalOrder.prototype.addItem = function(order, item, options) {
        var itemIndex = iPerformVariableLookup.indexOf(order, item.id)
            , flattened = flat(item)
            ;

        options = options || {}

        if(itemIndex !== -1) {
            throw new Error('this item already exists in the order')
        }

        if(options.prepend === true) {
            order.flattened.unshift.apply(order.flattened, flattened)
            item.parent = order.ordered
            order.ordered.prependItem(item)
        } else {
            order.flattened.push.apply(order.flattened, flattened)

            order.ordered.addItem(item)
        }

        order.orderedIndex = rebuildOrderIdMapFromFlattenedIndex(order.flattened)
    }

    IMutateHierarchicalOrder.prototype.switchItemsOrder = function(order, item1, item2) {
        var item1Index = iPerformVariableLookup.indexOf(order, item1.id)
            , item2Index = iPerformVariableLookup.indexOf(order, item2.id)
            , parent = item1.parent
            ;

        if(item2Index === -1) {
            throw new Error('This item does not belong to the hierarchical order')
        }

        parent.switchOrder(item1, item2)

        order.flattened[item1Index] = item2
        order.flattened[item2Index] = item1

        order.orderedIndex.set(item1.id, item2Index)
        order.orderedIndex.set(item2.id, item1Index)
    }

    IMutateHierarchicalOrder.prototype.moveItemBefore = function(order, item, before) {
        var itemIndex = iPerformVariableLookup.indexOf(order, item.id)
            , beforeIndex = iPerformVariableLookup.indexOf(order, before.id)
            , parent
            ;

        if(itemIndex === -1) {
            throw new Error('This item does not belong to the hierarchical order')
        }

        if(beforeIndex === -1) {
            throw new Error('This item does not belong to the hierarchical order')
        }

        if(itemIndex !== beforeIndex) {
            parent = item.parent
            parent.moveItemBefore(item, before)
            order.flattened.splice(itemIndex, 1)
            order.orderedIndex = rebuildOrderIdMapFromFlattenedIndex(order.flattened)
            beforeIndex = iPerformVariableLookup.indexOf(order, before.id)
            order.flattened.splice(beforeIndex, 0, item)
            order.orderedIndex = rebuildOrderIdMapFromFlattenedIndex(order.flattened)
        }
    }

    IMutateHierarchicalOrder.prototype.createGroupWithParent = function(order, name, parent) {
        var parentIndex
            , newGroup
            , existingItem
            ;

        parentIndex = parent === order.ordered ? 0 : iPerformVariableLookup.indexOf(order, parent.id)

        if(parentIndex === -1) {
            throw new Error('The group parent does not belong to the hierarchical order')
        }

        existingItem = parent.findItemNamed(name)

        if(existingItem && existingItem.hierarchicalType === 'group') {
            throw new Error('The parent already contains an item named ' + name)
        }

        newGroup = new Group(name, parent)
        parent.prependItem(newGroup)

        order.flattened.splice(parentIndex+1, 0, newGroup)
        order.orderedIndex = rebuildOrderIdMapFromFlattenedIndex(order.flattened)
        return newGroup
    }

    IMutateHierarchicalOrder.prototype.removeGroup = function(order, group) {
        var groupIndex
            , parent
            ;

        if(group === order.ordered) {
            throw new Error('The root node can\'t be deleted')
        }

        groupIndex = iPerformVariableLookup.indexOf(order, group.id)


        if(groupIndex === -1) {
            throw new Error('This group does not belong to the hierarchical order')
        }

        parent = group.parent
        parent.insertAfter(group.items, group)
        parent.removeItem(group)

        order.flattened.splice(groupIndex, 1)
        order.orderedIndex = rebuildOrderIdMapFromFlattenedIndex(order.flattened)
    }

    return new IMutateHierarchicalOrder()
}

IMutateHierarchicalOrderFactory.$inject = [
    'iPerformVariableLookup'
    , 'iGetVariableHash'
    , 'Group'
    , 'Map'
]
