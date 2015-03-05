'use strict';

module.exports = HierarchicalVariablesFactory

HierarchicalVariablesFactory.$inject = [
    'iBuildHierarchicalOrder'
    , 'iPerformVariableLookup'
    , 'iMutateHierarchicalOrder'
]

/**
 * @class HierarchicalVariablesFactory
 * @classdesc Creates a {HierarchicalVariables} instance for a single dataset
 * */
function HierarchicalVariablesFactory(iBuildHierarchicalOrder, iPerformVariableLookup, iMutateHierarchicalOrder) {

    function assert(pred, msg){
        if(!pred){
            throw new Error(msg)
        }
    }

    /**
     * @class HierarchicalVariables
     * @classdesc Hierarchical variables for a dataset
     * @memberof HierarchicalVariablesFactory
     * @param String datasetId
     * @param ShojiCatalog variables
     * @param ShojiView order one of the hierarchical views from the `variables` catalog
     * */
    function HierarchicalVariables(dataset, catalogs, order) {
        assert(dataset, 'datasetId is required')
        assert(order,'order is required')

        /**
         * @property Url datasetId - the url for the dataset
         * @memberof HierarchicalVariables.prototype
         * */
        this.datasetId = dataset

        /**
         * @property Url orderId - the url for the order used to construct this
         * @memberof HierarchicalVariables.prototype
         * */
        this.orderId = order.self
        this.catalogs = catalogs

        this.order = iBuildHierarchicalOrder(this.catalogs, order)

    }

    HierarchicalVariables.prototype.reorderedBy = function(order) {
        var variables = new HierarchicalVariables(this.datasetId, this.catalogs, order)
            ;

        return variables
    }

    HierarchicalVariables.prototype.flatten = function() {
        return this.order.flattened
    }

    HierarchicalVariables.prototype.byId = function(variableId) {
        return iPerformVariableLookup.byId(this.order, variableId)
    }

    HierarchicalVariables.prototype.fromCatalog = function(variableId) {
        return iPerformVariableLookup.fromCatalog(this.catalogs.principal(), variableId)
    }

    HierarchicalVariables.prototype.indexOf = function(variableId) {
        return iPerformVariableLookup.indexOf(this.order, variableId)
    }

    HierarchicalVariables.prototype.slice = function() {
        return this.order.flattened.slice.apply(this.order.flattened, arguments)
    }

    HierarchicalVariables.prototype.at = function(index) {
        return iPerformVariableLookup.at(this.order, index)
    }

    HierarchicalVariables.prototype.firstVariable = function(index) {
        return iPerformVariableLookup.firstVariable(this.order, index)
    }

    HierarchicalVariables.prototype.moveItemToGroup = function(item, group) {
        iMutateHierarchicalOrder.moveItemToGroup(this.order, item, group)
    }

    HierarchicalVariables.prototype.switchItemsOrder = function(item1, item2) {
        iMutateHierarchicalOrder.switchItemsOrder(this.order, item1, item2)
    }

    HierarchicalVariables.prototype.moveItemBefore = function(item, before) {
        iMutateHierarchicalOrder.moveItemBefore(this.order, item, before)
    }

    HierarchicalVariables.prototype.createGroupWithParent = function(name, parent) {
        return iMutateHierarchicalOrder.createGroupWithParent(this.order, name, parent)
    }

    HierarchicalVariables.prototype.removeGroup = function(group) {
        iMutateHierarchicalOrder.removeGroup(this.order, group)
    }

    /**
     * @method variables - the variables resource used to build this instance
     * @return Resource the shoji resource at /variables/
     * **/
    HierarchicalVariables.prototype.variables = function() {
        return this._variables.principal()
    }

    Object.defineProperties(HierarchicalVariables.prototype, {
        'groups' : {
            get : function() {
                throw new Error('deprecated property. use flatten instead.')
            }
        }

        , 'ordered' : {
            get : function() {
                return this.order.ordered
            }
        }

        ,'weights' : {
            get : function() {
                return this.catalogs.principal().urls.weights
            }
        }

        ,'searchUrl' : {
            get : function() {
                return this.catalogs.principal().views.search.self
            }
        }

        ,'catalogId' : {
            get : function() {
                return this.catalogs.principal().self
            }
        }

        , 'length' : {
            get :function() {
                return this.order.length
            }
        }
    })

    return HierarchicalVariables
}
