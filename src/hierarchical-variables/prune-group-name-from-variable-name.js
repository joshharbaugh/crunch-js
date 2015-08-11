'use strict'

module.exports = PruneGroupNameFromVariableNameFactory

PruneGroupNameFromVariableNameFactory.$inject = [
    'lodash'
]

function PruneGroupNameFromVariableNameFactory(_) {

    function getInverseHierarchy(group) {
        var current = group
            , temp
            , first = null
            ;

        while(current) {
            temp = first
            first = { item : current }
            first.child = temp
            current = current.parent
        }

        return first
    }

    function prune(variableName, groupName) {
        var pruned = variableName
            , pattern = new RegExp('^' + cleanGroupName(groupName) + '[-\\s]+', 'gi')
            ;

        if(_.isString(groupName)) {
            pruned = (pruned.replace(pattern, '') || pruned)
        }

        return pruned
    }

    function cleanGroupName(groupName) {
        return groupName.replace(/([\\(\\)]+)/gi, "\\$1")
    }

    return function(variableName, group) {
        var current = getInverseHierarchy(group)
            , pruned  = variableName
            ;

        while(current) {
            pruned = prune(pruned, current.item.name)
            current = current.child
        }

        return pruned
    }
}
