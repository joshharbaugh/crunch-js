'use strict'

module.exports = ShojiViewFactory

function ShojiViewFactory(ShojiObject) {

    function ShojiView() {
        ShojiObject.apply(this, arguments)
    }

    ShojiView.prototype = Object.create(ShojiObject.prototype)

    Object.defineProperties(ShojiView.prototype, {
        element : {
            value : 'shoji:view'
        }
    })

    return ShojiView
}

ShojiViewFactory.$inject = ['ShojiObject']