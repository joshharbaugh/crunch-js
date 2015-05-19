'use strict'

module.exports = ShojiOrderFactory

function ShojiOrderFactory(ShojiObject) {

    function ShojiOrder() {
        ShojiObject.apply(this, arguments)
    }

    ShojiOrder.prototype = Object.create(ShojiObject.prototype)

    ShojiOrder.prototype.parse = function(data) {
        ShojiObject.prototype.parse.apply(this, arguments)
        this.graph = data.graph
        return this
    }

    return ShojiOrder
}

ShojiOrderFactory.$inject = ['ShojiObject']