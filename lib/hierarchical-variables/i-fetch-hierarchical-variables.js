'use strict'

module.exports = IFetchHierarchicalVariablesFactory

IFetchHierarchicalVariablesFactory.$inject = [
    'currentDataset'
    , 'Shoji'
    , '$q'
    , 'VariableCatalogList'
    , 'HierarchicalVariables'
]

function IFetchHierarchicalVariablesFactory(currentDataset, Shoji, $q, VariableCatalogList, HierarchicalVariables) {

    function loadVariables(acc, dataset){
        acc.dataset = dataset

        return dataset.urls.variables.map({
            noCache : true
            , 'params': {
                'relative':'on'
                , 'nosubvars': 1
            }
        }).then(function(variables) {
            acc.variableCatalogs = new VariableCatalogList()
            acc.variableCatalogs.add(variables)
        })
    }

    function loadJoins(acc) {
        var dataset = acc.dataset
            ;

        return dataset.urls.joins.map()
    }

    function loadSubordinateVariables(acc, joins) {
        var promises = []
            ;

        joins.index.forEach(function(join) {
            var promise
                ;

            promise = Shoji(join.variables).map({
                params: {
                    relative: "on"
                    ,nosubvars: 1
                }
            }).then(function(variables) {
                acc.variableCatalogs.add(variables)
            })

            promises.push(promise)
        })

        return $q.all(promises)
    }

    function loadOrder(acc) {
        var orderUrl = acc.variableCatalogs.principal().self.replace(/\?.*/gi, '') + 'hier/'
            ;

        return Shoji(orderUrl).map({
            noCache : true
            , params: {
                relative: 'on'
            }
        })
    }

    function returnData(acc, order) {
        return new HierarchicalVariables(acc.dataset.self, acc.variableCatalogs, order)
    }

    /**
     * @function iFetchHierarchicalVariables Requests the variable catalogs (included the joined ones)
     * and the hierarchical order that belongs to the current dataset.
     * @desc this makes no attempt at caching or other concerns tha shouldnt be done here...
     * @return {Object} An object with the following structure
     *     {
     *         dataset : the current dataset Shoji entity
     *         variableCatalogs : Array with all dataset's variable catalogs (included the joined ones)
     *         order : hierarchicalOrder
     *     }
     * @example
     * iFetchHierarchicalVariables()
     *  .then(function(data) {
     *      //Raw variable catalogs and hierarchical order
     *  })
     *  */
    function iFetchHierarchicalVariables(q) {
        var data = {
            variables: undefined
            ,order: undefined
            ,dataset:undefined
        }

        var handlers = [
            loadVariables
            ,loadJoins
            ,loadSubordinateVariables
            ,loadOrder
            ,returnData
        ]
        return currentDataset.fetch().then(function(dataset) {
            return dataset.reduce(data,handlers)
        })
    }

    return iFetchHierarchicalVariables
}
