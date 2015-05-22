'use strict'

module.exports = ShojiOrderFactory

function ShojiOrderFactory(ShojiObject) {

    function ShojiOrder() {
        ShojiObject.apply(this, arguments)
    }

    ShojiOrder.prototype = Object.create(ShojiObject.prototype)

    Object.defineProperties(ShojiOrder.prototype, {
        element : {
            value : 'shoji:order'
        }
    })

    return ShojiOrder
}

ShojiOrderFactory.$inject = ['ShojiObject']