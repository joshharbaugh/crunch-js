'use strict'

module.exports = IPerformVariableLookupFactory

IPerformVariableLookupFactory.$inject = ['iGetVariableHash']

function IPerformVariableLookupFactory(iGetVariableHash) {

    function IPerformVariableLookup() {

    }

    IPerformVariableLookup.prototype.byId = function(hierarchicalOrder, itemId) {
        var index = this.indexOf(hierarchicalOrder, itemId)
            , item
            , found
            ;

        if(index > -1) {
            item = hierarchicalOrder.flattened[index]

            //it's refering to a subvariable
            if(itemId.indexOf(item.id) === -1) {
                item.subvariables.some(function(subvar) {
                    var matchId = subvar.id || subvar
                        , matches = itemId.indexOf(matchId) > -1 || matchId.indexOf(itemId) > -1
                        ;

                    if(matches) {
                        found = subvar
                    }

                    return matches
                })
            } else {
                found = item
            }

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
