;
module.exports = (function() {
    'use strict';
    var measureDate = {
        self: '/api/datasets/123/variables/abc/'
        , element: 'shoji:entity'
        , body: {
            id: 'abc'
        }
    };
    return {
        variable: measureDate
    }
})
    .call(this);