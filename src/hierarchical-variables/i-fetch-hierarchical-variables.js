'use strict'

module.exports = IFetchHierarchicalVariablesFactory

IFetchHierarchicalVariablesFactory.$inject = [
    'currentDataset'
    , 'Shoji'
    , '$q'
    , 'VariableCatalogList'
    , 'SubvariablesCatalogList'
    , 'HierarchicalVariables'
]

function IFetchHierarchicalVariablesFactory(currentDataset, Shoji, $q, VariableCatalogList, SubvariablesCatalogList, HierarchicalVariables) {
    function loadVariables(acc, dataset){
        acc.dataset = dataset

        return dataset.catalogs.variables.map({
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
        var dataset = acc.dataset;

        return dataset.catalogs.joins.map()
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
        return acc.variableCatalogs.principal().orders.hier.map({
            noCache : true
            , params: {
                relative: 'on'
            }
        })
    }

    function loadPrivateVariables(acc, order) {
        var privateCatalog
            ;

        acc.order = order

        privateCatalog = acc.variableCatalogs.principal().catalogs.private

        if(privateCatalog) {
            return privateCatalog.map({
                noCache : true
            }).then(function(privateCatalog) {
                return new SubvariablesCatalogList([privateCatalog])
            })
        } else {
            return undefined
        }
    }

    function buildWithPrivateVariables(acc, privateVariables) {
        var deferred = $q.defer()
            ;

        try {
            deferred.resolve(new HierarchicalVariables(acc.variableCatalogs
                , acc.order
                , privateVariables
            ))
        } catch(e) {
            deferred.reject(new Error('invalid hierarchical variables'))
        }

        return deferred.promise
    }

    function build(acc, order) {
        var deferred = $q.defer()
            ;

        try {
            deferred.resolve(new HierarchicalVariables(acc.variableCatalogs
                , order))
        } catch(e) {
            deferred.reject(new Error('invalid hierarchical variables'))
        }

        return deferred.promise
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
            ,includePrivateVariables: q.includePrivateVariables
        }

        var handlers = [
            loadVariables
            ,loadJoins
            ,loadSubordinateVariables
            ,loadOrder
        ]

        if(q.includePrivateVariables === true) {
            handlers.push(loadPrivateVariables, buildWithPrivateVariables)
        } else {
            handlers.push(build)
        }

        return currentDataset.fetch().then(function(dataset) {
            return dataset.reduce(data,handlers)
        })
    }

    return iFetchHierarchicalVariables
}
