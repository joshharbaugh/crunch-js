;
module.exports = (function() {
    'use strict';
    var api = {
        element: 'shoji:entity'
        , self: '/api/'
        , description: 'The API root. GET user_url to access your Crunch resources. GET logout_url to sign out.'
        , urls: {
            roles_url: '/api/roles/users/'
            , logout_url: '/api/logout/'
            , user_url: '/api/users***REMOVED***'
        }
    };
    var catVariable1 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/variables/coordinateType/'
        , body: {
            numeric_value: ''
            , description: ''
            , tags: ['tag 1', 'tag 2']
            , name: 'Coordinate Type'
            , source: ''
            , alias: 'coordinateType'
            , header_order: 12
            , id: '519be7f8375e4fa9e222d560'
            , original_alias: 'race'
            , wording: 'Race/Ethnicity'
            , type: 'categorical'
            , dataset_id: '123'
            , categories: [{
                    id: 'a912ce58bca9314f6dea1cd56659d44d'
                    , numeric_value: 1
                    , name: 'White'
                    , missing: false
                }
                , {
                    id: 'f37caa3c5831599f72ebc16869793041'
                    , numeric_value: 2
                    , name: 'Black or African-American'
                    , missing: false
                }
                , {
                    id: 'a88da763fed3e69e5d137cb9606b42c2'
                    , numeric_value: 3
                    , name: 'Hispanic or Latino'
                    , missing: false
                }
                , {
                    id: '21ea1a9a6829b891076f6e5ecc537257'
                    , numeric_value: 4
                    , name: 'Asian or Asian-American'
                    , missing: false
                }
                , {
                    id: '26ebd274355e048f33d43c5ccb577c18'
                    , numeric_value: 5
                    , name: 'Native American'
                    , missing: false
                }
                , {
                    id: '7edf7337bfefa9ad3f8f971abe117870'
                    , numeric_value: 6
                    , name: 'Mixed Race'
                    , missing: false
                }
                , {
                    id: 'c342ebabc06e744e69fc49919686d1da'
                    , numeric_value: 7
                    , name: 'Other'
                    , missing: true
                }
                , {
                    id: 'b6546b96379b72425f51afedd228824f'
                    , numeric_value: 8
                    , name: 'Middle Eastern'
                    , missing: false
                }
            ]
            , view: {
                show_counts: true
                , show_numeric_values: false
            }
        }
        , urls: {
            summary_url: '/api/datasets/123/variables/coordinateType/summary/'
            , cast_url: '/api/datasets/123/variables/coordinateType/cast/'
            , values_url: '/api/datasets/123/variables/coordinateType/values/'
        }
        , specification: '/api/specifications/categorical_variables/'
        , description: 'Details for a given Variable'
    };
    var dataset123 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/'
        , specification: '/api/specifications/datasets/'
        , description: 'Detail for a given dataset'
        , body: {
            user***REMOVED***
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
    var dataset123Variables = {
        element: 'shoji:catalog'
        , self: '/api/datasets/123/variables/'
        , specification: '/api/specifications/variables/'
        , description: 'List of Variables of this dataset'
        , entities: ['/api/datasets/123/variables/common_Name/', '/api/datasets/123/variables/measure_Date/', '/api/datasets/123/variables/mil_Time/', '/api/datasets/123/variables/yyyy/', '/api/datasets/123/variables/mm/', '/api/datasets/123/variables/dd/', '/api/datasets/123/variables/total_Num/', '/api/datasets/123/variables/basin_Name/', '/api/datasets/123/variables/bow_Af_Name/', '/api/datasets/123/variables/bow_Number/', '/api/datasets/123/variables/latitude/', '/api/datasets/123/variables/longitude/', '/api/datasets/123/variables/coordinateType/'
        ]
    };
    var user = {
        element: 'shoji:entity'
        , self: '/api/users***REMOVED***'
        , specification: '/api/specifications/users/'
        , description: 'Details for a User'
        , body: {
            first_name: 'Jean Luque'
            , last_name: 'Piccard'
            , email: '***REMOVED***'
            , ***REMOVED***
        }
        , urls: {
            account_role_url: '/api/accounts/00001/user_roles/5181fc7307a7d81f41bbece1/'
            , invite_url: '/api/users***REMOVED***invite/'
            , password_reset_url: '/api/users***REMOVED***password_reset/'
            , account_url: '/api/accounts/00001/'
            , password_url: '/api/users***REMOVED***password/'
            , sources_url: '/api/users***REMOVED***sources/'
            , projects_url: '/api/users***REMOVED***projects/'
            , datasets_url: '/api/users***REMOVED***datasets/'
        }
    };
    var userDatasets = {
        element: 'shoji:catalog'
        , self: '/api/users***REMOVED***datasets/'
        , specification: '/api/specifications/datasets/'
        , description: 'List of Datasets that belong to this user. POST a Dataset representation (serialized JSON) here to create a new one; a 201 response indicates success and returns the location of the new object. GET that URL to retrieve the object.'
        , entities: ['/api/datasets/123/']
    };

    var shojiOrder = {
        "graph": [
            {
                "weekly questions": [
                    "../8c89f97135a8423a840fb08a4d450bae/",
                    "../7eb48bdcc7064494b7e69a13cdb90620/",
                    "../4226c1b9c33648f7a381cd7ff5f0695d/",
                    "../c6cb647b138b4dba821f35bf3d6f7c34/",
                    "../96913ca8aa3a407ea1c44fd4c9145b16/",
                    "../8ed897c8d6b841cfbb9504a54fbf2e77/",
                    "../1d10ee9977fd4ac2ae41e52b72246b36/"
                ]
            },
            {
                "system variables": [
                    "../41a82fad84a741889e4c84ae5a22d234/",
                    "../d72c23bd1f5549e997785ce463ec097e/",
                    "../634bb9a5524e4f2f823994f46dd96707/"
                ]
            },
            {
                "demographics": [
                    "../17847ea4347d41339914b4a1028efbcc/",
                    "../bc1279b85e1c4354a8e9a70b3886fc70/",
                    "../72bf71fb080f4d389314d3c68293c685/",
                    "../7fbb14b8b2d44e04a1773634c5da2ab8/",
                    "../0e6a29c58a3249e48a32e72a9658c27d/",
                    "../bc94c329a55c4662a77d9fbaa57f8227/",
                    "../93ee4309482849229a3ae7b5f22b095a/",
                    "../7f0f4489bc694898bf47ff9b289ce857/",
                    "../91db4f7a2f2045de83131e4d91f90e27/"
                ]
            },
            "../cb91248b19f845baa224c81237c8556d/",
            "../730a315dfca44908aad4ad04f6cde010/"
        ],
        "self": "***REMOVED***/api/datasets/b13e07346b1c4fc3b5c250ffc85ee0a0/variables/hier/",
        "description": "Hierarchical order of dataset variables",
        "element": "shoji:order"
    }

    return {
        api: api
        , catVariable1: catVariable1
        , dataset123: dataset123
        , dataset123Variables: dataset123Variables
        , user: user
        , userDatasets: userDatasets
        , shojiOrder : shojiOrder
    }
})
    .call(this);
