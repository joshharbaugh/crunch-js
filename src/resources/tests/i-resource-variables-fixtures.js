;
module.exports = (function() {
    'use strict';
    var dataset123Variables = {
        element: 'shoji:catalog'
        , self: '/api/datasets/123/variables/'
        , specification: '/api/specifications/variables/'
        , description: 'List of Variables of this dataset'
        , index: {
            '/api/datasets/123/variables/measure_Date/':{}
            , '/api/datasets/123/variables/mil_Time/':{}
            , '/api/datasets/123/variables/basin_Name/' :{}
            , '/api/datasets/123/variables/bow_Af_Name/' :{}
            , '/api/datasets/123/variables/coordinateType/':{}
        }
    };
    var dataset123VariablesOnlyMeasureDate = {
        element: 'shoji:catalog'
        , self: '/api/datasets/123/variables/'
        , specification: '/api/specifications/variables/'
        , description: 'List of Variables of this dataset'
        , index: {
            '/api/datasets/123/variables/measure_Date/':{}
        }
    };
    return {
        variables: dataset123Variables
        , variablesOnlyMeasureDate: dataset123VariablesOnlyMeasureDate
    }
})
    .call(this);
