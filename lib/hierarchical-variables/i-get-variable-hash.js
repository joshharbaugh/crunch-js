'use strict'

module.exports = IGetVariableHashSegmentFactory

IGetVariableHashSegmentFactory.$inject = []

function IGetVariableHashSegmentFactory() {

    return function getHashSegment(url) {
        var pruneStart = url.lastIndexOf('/', url.length-2) + 1
            , pruned = url.substring(pruneStart)
            ;

        return (pruneStart === -1) ? url : pruned
    }
}
