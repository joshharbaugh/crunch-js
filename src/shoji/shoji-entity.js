'use strict'

module.exports = ShojiEntityFactory

function ShojiEntityFactory(ShojiObject, assert, _) {

    function ShojiEntity() {
        ShojiObject.apply(this, arguments)
    }

    ShojiEntity.prototype = Object.create(ShojiObject.prototype)

    Object.defineProperties(ShojiEntity.prototype, {
        element : {
            value : 'shoji:entity'
        }
    })

    return ShojiEntity
}

ShojiEntityFactory.$inject = ['ShojiObject', 'assert', 'lodash']