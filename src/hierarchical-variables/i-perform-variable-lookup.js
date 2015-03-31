'use strict'

module.exports = IPerformVariableLookupFactory

IPerformVariableLookupFactory.$inject = ['iGetVariableHash']

function IPerformVariableLookupFactory(iGetVariableHash) {

    function IPerformVariableLookup() {

    }

    //This one is linear so it's quite expensive
    IPerformVariableLookup.prototype.byName = function(hierarchicalOrder, itemName) {
        var itemFound
            ;

        hierarchicalOrder.flattened.some(function(item) {
            if(item.name === itemName) {
                itemFound = item
                return true
            }
        })

        return itemFound
    }

    IPerformVariableLookup.prototype.byId = function(hierarchicalOrder, itemId) {
        var index = this.indexOf(hierarchicalOrder, itemId)
            , item
            , found
            ;

        if(index > -1) {
            found = hierarchicalOrder.flattened[index]
        }

        return found
    }

    IPerformVariableLookup.prototype.fromCatalog = function(catalog, itemId) {
        var pruned = iGetVariableHash(itemId)
        return catalog.index[pruned]
    }

    IPerformVariableLookup.prototype.indexOf = function(hierarchicalOrder, itemId) {
        var pruned
            , index
            ;

        if(!itemId) {
            index = -1
        } else {
            pruned = iGetVariableHash(itemId)
            index = hierarchicalOrder.orderedIndex.get(pruned.replace('/', ''))
        }

        return (typeof index === 'number') ? index : -1
    }

    IPerformVariableLookup.prototype.at = function(hierarchicalOrder, index) {
        return hierarchicalOrder.flattened[index]
    }

    IPerformVariableLookup.prototype.firstVariable = function(hierarchicalOrder) {
        var first
            ;

        hierarchicalOrder.flattened.some(function(item) {
            first = item
            return !first.discarded && item.hierarchicalType === 'variable'
        })

        return first
    }

    return new IPerformVariableLookup()
}
