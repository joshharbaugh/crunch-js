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
     * Creates a new instance of HierarchicalVariables
     * @param catalogs catalogs list
     * @param order hierarchical order
     * @param privateVariables private variables if they exist (optional)
     * @constructor
     */
    function HierarchicalVariables(catalogs, order, privateVariables) {
        assert(order,'order is required')
        /**
         * @property Url orderId - the url for the order used to construct this
         * @memberof HierarchicalVariables.prototype
         * */
        this.orderId = order.self
        this.catalogs = catalogs
        this.privateVariables = privateVariables

        this.order = iBuildHierarchicalOrder(catalogs, order, privateVariables)
    }

    HierarchicalVariables.prototype.exposePrivateVariables = function() {
        var privateOrder = { 'My Variables' : [] }
            , fakeShojiOrder = { graph : [privateOrder] }
            , privateHierarchicalOrder
            , privateGroup
            , index = []
            ;

        if(!this.privateVariables) {
            throw new Error('Please provide a privateVariables catalog')
        }

        if(!this.byName('My Variables')) {

            this.privateVariables.principal().index.forEach(function(variableTuple) {
                variableTuple.private = true
                index.push(variableTuple)
            })

            index
                .sort(function(a, b) {
                    var r
                        ;

                    if(a.name < b.name) {
                        r = -1
                    } else if (a.name > b.name) {
                        r = 1
                    } else {
                        r = 0
                    }

                    return r
                })
                .forEach(function(tuple) {
                    privateOrder['My Variables'].push(tuple.self)
                })

            privateHierarchicalOrder = iBuildHierarchicalOrder(this.privateVariables, fakeShojiOrder)
            privateGroup = privateHierarchicalOrder.ordered.items[0]
            privateGroup.private = true
            iMutateHierarchicalOrder.addItem(this.order, privateGroup, {
                prepend : true
            })
        }
    }

    HierarchicalVariables.prototype.reorderedBy = function(order) {
        return new HierarchicalVariables(this.catalogs, order, this.privateVariables)
    }

    HierarchicalVariables.prototype.flatten = function() {
        return this.order.flattened
    }

    HierarchicalVariables.prototype.byId = function(variableId) {
        return iPerformVariableLookup.byId(this.order, variableId)
    }

    HierarchicalVariables.prototype.byName = function(itemName) {
        return iPerformVariableLookup.byName(this.order, itemName)
    }

    HierarchicalVariables.prototype.byAlias = function(variableId) {
        return iPerformVariableLookup.byAlias(this.order, variableId)
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
