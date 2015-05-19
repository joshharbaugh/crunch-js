'use strict'

module.exports = ShojiEntityFactory

function ShojiEntityFactory(ShojiObject, assert, _) {

    function ShojiEntity() {
        ShojiObject.apply(this, arguments)
    }

    ShojiEntity.prototype = Object.create(ShojiObject.prototype)

    ShojiEntity.prototype.parse = function(data) {
        ShojiObject.prototype.parse.call(this, data)

        assert(data, 'Invalid data object')
        assert(data.body, 'Entities should have a body')

        return _.extend(this, data.body)
    }

    Object.defineProperties(ShojiEntity.prototype, {
        element : {
            value : 'shoji:entity'
        }
    })

    return ShojiEntity
}

ShojiEntityFactory.$inject = ['ShojiObject', 'assert', 'lodash']