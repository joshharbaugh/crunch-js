'use strict';

module.exports = {
    $get : getICacheHierarchicalVariablesFetching
}

getICacheHierarchicalVariablesFetching.$inject = [
    '$delegate'
    , 'cachedHierarchicalVariables'
]

function getICacheHierarchicalVariablesFetching($delegate, cachedHierarchicalVariables) {

    function cache(){
        return $delegate
            .apply($delegate, arguments)
            .then(function(hierarchicalVariables) {
                cachedHierarchicalVariables.current = hierarchicalVariables
                return hierarchicalVariables
            })
    }

    return cache
}
