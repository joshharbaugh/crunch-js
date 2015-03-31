'use strict'

var mocks = require('angular-mocks')
    , mockShoji = require('./mock-shoji')
    , hierarchicalVariablesMod = require('../hierarchical-variables/index')
    ;

exports.registerModule = function() {
    mockShoji.registerModule()
    angular.mock.module(hierarchicalVariablesMod().name)
}

exports.getHierarchicalVariablesObj = function(dataset, catalogs, order) {
    var hierarchicalVariables
        , catalogs = (catalogs instanceof Array) ? catalogs : [catalogs]
        , getShojiObj = mockShoji.getShojiObj
        ;

    angular.mock.inject(function(VariableCatalogList, HierarchicalVariables) {
        var varCatalogs = new VariableCatalogList(catalogs.map(getShojiObj))
            ;

        hierarchicalVariables = new HierarchicalVariables(varCatalogs, getShojiObj(order))
    })

    return hierarchicalVariables
}
