'use strict';


/**
 * @module HierarchicalVariables
 * */
module.exports = buildModule

function buildModule(moduleName, cfg) {
    var angular = require('angular')
        , _ = require('lodash')
        ;

    var mod = angular.module(moduleName || 'hierarchical-variables',[])

    mod.factory('lodash', function() {
        return _
    })

    mod.factory('Map', function() {
        return require('es6-map')
    })

    //Services
    mod.factory('pruneGroupNameFromVariableName', require('./prune-group-name-from-variable-name'))
    mod.factory('iGenerateVariableFullName', require('./i-generate-variable-full-name'))
    mod.factory('iFetchSubvariables', require('./i-fetch-subvariables'))
    mod.factory('iGetVariableHash', require('./i-get-variable-hash'))
    mod.factory('iBuildHierarchicalOrder', require('./i-build-hierarchical-order'))
    mod.factory('iPerformVariableLookup', require('./i-perform-variable-lookup'))
    mod.factory('iMutateHierarchicalOrder', require('./i-mutate-hierarchical-order'))
    mod.factory('iCalculateItemLevel', require('./i-calculate-item-level'))
    mod.factory('cachedHierarchicalVariables', require('./cached-hierarchical-variables'))



    //Types
    mod.factory('VariableCatalogList', require('./variable-catalog-list'))
    mod.factory('SubvariablesCatalogList', require('./subvariables-catalog-list'))
    mod.factory('HierarchicalOrder', require('./hierarchical-order'))
    mod.factory('Group', require('./group'))
    mod.factory('variableFactory', require('./variable-factory'))
    mod.factory('HierarchicalVariables',require('./hierarchical-variables'))

    mod.provider('iThrottleHierarchicalVariablesFetching',require('./i-throttle-hierarchical-variables-fetching'))
    mod.provider('iCacheHierarchicalVariables', require('./i-cache-hierarchical-variables'))

    //main entry point
    mod.factory('iFetchHierarchicalVariables', require('./i-fetch-hierarchical-variables'))

    mod.config([
        '$provide'
        ,'iThrottleHierarchicalVariablesFetchingProvider'
        , 'iCacheHierarchicalVariablesProvider'
        , function($provide, throttleDecorator, cacheDecorator){
            $provide.decorator('iFetchHierarchicalVariables', throttleDecorator.$get)
            $provide.decorator('iFetchHierarchicalVariables', cacheDecorator.$get)
        }
    ])

    return mod
}
