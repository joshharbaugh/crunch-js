'use strict'

module.exports = ShojiViewFactory

function ShojiViewFactory(ShojiObject) {

    function ShojiView() {
        ShojiObject.apply(this, arguments)
    }

    ShojiView.prototype = Object.create(ShojiObject.prototype)

    ShojiView.prototype.parse = function(data) {
        ShojiObject.prototype.parse.apply(this, arguments)
        this.value = data.value
        return this
    }

    return ShojiView
}

ShojiViewFactory.$inject = ['ShojiObject']