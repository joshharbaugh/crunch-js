'use strict'

module.exports = ICalculateItemLevelFactory

function ICalculateItemLevelFactory() {

    function iCalculateItemLevel(item) {
        var level = 1
            , parent = item.parent
            ;

        while(parent) {
            level += 1
            parent = parent.parent
        }

        return level
    }

    return iCalculateItemLevel
}
