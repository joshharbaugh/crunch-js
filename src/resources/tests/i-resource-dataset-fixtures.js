;
module.exports = (function() {
    'use strict';
    var dataset123 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/'
        , specification: '/api/specifications/datasets/'
        , description: 'Detail for a given dataset'
        , body: {
            userid: 'test_user'
            , name: 'oyster.csv'
            , sources: ['519be7f3375e4fa9e222d54f']
            , id: '123'
            , categories: []
            , description: ''
        }
        , urls: {
            summary_url: '/api/datasets/123/summary/'
            , redo_url: '/api/datasets/123/redo/'
            , users_url: '/api/datasets/123/users/'
            , variables_url: '/api/datasets/123/variables/'
            , filters_url: '/api/datasets/123/filters/'
            , all_variables_url: '/api/datasets/123/all_variables/'
            , sources_url: '/api/datasets/123/sources/'
            , actions_url: '/api/datasets/123/actions/'
            , rows_url: '/api/datasets/123/rows/'
            , undo_url: '/api/datasets/123/undo/'
        }
    };
    return {
        dataset: dataset123
    }
})
    .call(this);