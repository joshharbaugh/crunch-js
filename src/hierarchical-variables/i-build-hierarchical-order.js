'use strict'

module.exports = IBuildHierarchicalOrderFactory

IBuildHierarchicalOrderFactory.$inject = [
    'HierarchicalOrder'
    , 'Group'
    , 'variableFactory'
    , 'Map'
    , 'iGetVariableHash'
]

function IBuildHierarchicalOrderFactory(HierarchicalOrder
    , Group
    , variableFactory
    , Map
    , iGetVariableHash) {

    function assert(pred, msg){
        if(!pred){
            throw new Error(msg)
        }
    }

    return function iBuildHierarchicalOrder(variables, shojiOrder, privateVariables) {
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
                , previousItems
                ;

            flattened[numericIndex] = item

            if(orderedIndex.has(item.id)) {
                previousItems = orderedIndex.get(item.id)
                //save different indexes for the same id in a map
                previousItems = typeof previousItems === 'number' ?
                    { 'main' : previousItems } :
                    previousItems
                previousItems[item.subordinateDataset] = numericIndex
                orderedIndex.set(item.id, previousItems)
            } else {
                orderedIndex.set(item.id, numericIndex)
            }

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

            //Case where two variables in the hierarchy have the same id
            if(orderedIndex.has(varb.id)) {
                varb = variables.getVariable(url, true)
            }

            if(!varb && privateVariables) {
                varb = privateVariables.getVariable(url)
            }

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
                var trimmed = iGetVariableHash(subvariable)
                    ;

                orderedIndex.set(trimmed.replace('/',''), numericIndex)
            })
        }

        ordered = new Group('graph')
        flattened = []
        orderedIndex = new Map()
        addItems(shojiOrder.graph, ordered)

        return new HierarchicalOrder(ordered, flattened, orderedIndex)
    }
}
