'use strict'

module.exports = HierarchicalOrderFactory

HierarchicalOrderFactory.$inject = []

function HierarchicalOrderFactory() {

    function HierarchicalOrder(ordered, flattened, orderedIndex) {
        this.ordered = ordered
        this.flattened = flattened
        this.orderedIndex = orderedIndex
    }

    Object.defineProperties(HierarchicalOrder.prototype, {
        'groups' : {
            get : function() {
                throw new Error('deprecated property. use flatten instead.')
            }
        }

        , 'length' : {
            get :function() {
                return this.flattened.length
            }
        }
    })

    return HierarchicalOrder
}
