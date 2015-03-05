'use strict'

module.exports = IBuildHierarchicalOrderFactory

IBuildHierarchicalOrderFactory.$inject = [
    'HierarchicalOrder'
    , 'Group'
    , 'variableFactory'
    , 'Map'
]

function IBuildHierarchicalOrderFactory(HierarchicalOrder
    , Group
    , variableFactory
    , Map) {

    function assert(pred, msg){
        if(!pred){
            throw new Error(msg)
        }
    }

    return function iBuildHierarchicalOrder(variables, shojiOrder) {
        var numericIndex = 0
            , ordered
            , flattened
            , orderedIndex
            ;

        function addItems(itemsData, parent) {
            itemsData.forEach(function(item) {
                addItem(item, parent)
            })
        }

        function addItem(itemData, parent) {
            var simple = typeof itemData === 'string'
                , create = simple ? createVariable : createGroup
                , item = create(itemData, parent)
                ;

            flattened[numericIndex] = item
            orderedIndex.set(item.id, numericIndex)
            parent.addItem(item)

            if(simple) {
                //subvariables share the same index as their parent
                addSubItems(item)
                numericIndex += 1
            } else {
                //group items have an independent index
                numericIndex += 1
                addItems(itemData[item.name], item)
            }

        }

        function createVariable(url, parent) {
            var varb = variables.getVariable(url)
                , variable
                ;

            assert(varb,'variable not found with id ' + url)

            variable = variableFactory.create(varb, parent)

            return variable
        }

        function createGroup(groupData, parent) {
            var name = Object.keys(groupData)[0]
                , group = new Group(name, parent)
                ;

            return group
        }

        function addSubItems(item) {
            var subitems = item.subvariables || []
                ;

            subitems.forEach(function(subvariable) {
                var trimmed = subvariable.substr(0, subvariable.length-1)
                    ;

                orderedIndex.set(trimmed, numericIndex)
            })
        }

        ordered = new Group('graph')
        flattened = []
        orderedIndex = new Map()

        addItems(shojiOrder.graph, ordered)

        return new HierarchicalOrder(ordered, flattened, orderedIndex)
    }
}
