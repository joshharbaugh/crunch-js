'use strict'

module.exports = ShojiFactory

function ShojiFactory(ShojiObject) {

    function createShojiObjectFromUri(uri) {
        return new ShojiObject(uri)
    }

    return createShojiObjectFromUri
}

ShojiFactory.$inject = [
    'ShojiObject'
]