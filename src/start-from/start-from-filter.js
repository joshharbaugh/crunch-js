'use strict';

module.exports = StartFromFilter

StartFromFilter.$inject = [
]

function StartFromFilter(){
    return function filter(arr, start) {
        arr = (arr || []);
        start = (start || 0);

        return arr.slice(start)
    }
}
