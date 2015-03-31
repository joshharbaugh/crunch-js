;
module.exports = (function() {
    'use strict';
    var userDatasets = {
        element: 'shoji:catalog'
        , self: '/api/users***REMOVED***datasets/'
        , specification: '/api/specifications/datasets/'
        , description: 'List of Datasets that belong to this user. POST a Dataset representation (serialized JSON) here to create a new one; a 201 response indicates success and returns the location of the new object. GET that URL to retrieve the object.'
        , index: {
            '/api/datasets/123/':{}
            , '/api/datasets/234/':{}
        }
    };
    var userDatasetsOnly123 = {
        element: 'shoji:catalog'
        , self: '/api/users***REMOVED***datasets/'
        , specification: '/api/specifications/datasets/'
        , description: 'List of Datasets that belong to this user. POST a Dataset representation (serialized JSON) here to create a new one; a 201 response indicates success and returns the location of the new object. GET that URL to retrieve the object.'
        , index: {
            '/api/datasets/123/':{}
        }
    };
    return {
        datasets: userDatasets
        , datasetsOnly123: userDatasetsOnly123
    }
})
    .call(this);
