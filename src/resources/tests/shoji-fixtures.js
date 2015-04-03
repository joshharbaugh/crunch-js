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
            , user_url: '/api/users/test_user/'
        }
    };
    var catVariable1 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/variables/coordinateType/'
        , body: {
            numeric_value: ''
            , description: ''
            , tags: ['a', 'c']
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
    var catVariable2 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/variables/bow_Af_Name/'
        , body: {
            name: 'BOW_AF_Name'
            , tags: ['b']
            , description: ''
            , format: {}
            , max_chars: 39
            , alias: 'bow_Af_Name'
            , header_order: 8
            , dataset_id: '123'
            , type: 'categorical'
            , id: '5941cc8e54144b70baa5c2c736a64ef7'
            , categories: [{
                    numeric_value: null
                    , id: 1
                    , name: 'Atchafalaya Bay, Delta, Gulf waters'
                }
                , {
                    numeric_value: null
                    , id: 2
                    , name: 'Barataria Bay'
                }
                , {
                    numeric_value: null
                    , id: 3
                    , name: 'Calcasieu Lake'
                }
                , {
                    numeric_value: null
                    , id: 4
                    , name: 'Calcasieu River and Ship Channel'
                }
                , {
                    numeric_value: null
                    , id: 5
                    , name: 'Grid 12'
                }
                , {
                    numeric_value: null
                    , id: 6
                    , name: 'Grid 14'
                }
                , {
                    numeric_value: null
                    , id: 7
                    , name: 'Grid 15'
                }
                , {
                    numeric_value: null
                    , id: 8
                    , name: 'Grid 16'
                }
                , {
                    numeric_value: null
                    , id: 9
                    , name: 'California Bay and Breton Sound'
                }
                , {
                    numeric_value: null
                    , id: 10
                    , name: 'Lake Fortuna'
                }
                , {
                    numeric_value: null
                    , id: 11
                    , name: 'Lake Borgne'
                }
                , {
                    numeric_value: null
                    , id: 12
                    , name: 'Bays Gardene, Black, American and Crabe'
                }
                , {
                    numeric_value: null
                    , id: 13
                    , name: 'Lost Lake and Four League Bay'
                }
                , {
                    numeric_value: null
                    , id: 14
                    , name: 'Bayou Grand Caillou'
                }
                , {
                    numeric_value: null
                    , id: 15
                    , name: 'Bayou du Large'
                }
                , {
                    numeric_value: null
                    , id: 16
                    , name: 'Lake Barre'
                }
                , {
                    numeric_value: null
                    , id: 17
                    , name: 'Vermilion Bay'
                }
                , {
                    numeric_value: null
                    , id: 18
                    , name: 'East Cote Blanche Bay'
                }
            ]
            , view: {
                show_counts: false
                , show_numeric_values: false
                , column_width: 150
            }
        }
        , urls: {
            frequencies_url: '/api/datasets/123/variables/bow_Af_Name/frequencies/'
            , summary_url: '/api/datasets/123/variables/bow_Af_Name/summary/'
            , cast_url: '/api/datasets/123/variables/bow_Af_Name/cast/'
            , values_url: '/api/datasets/123/variables/bow_Af_Name/values/'
        }
        , specification: '/api/specifications/categorical_variables/'
        , description: 'Details for a given Variable'
    };
    var catVariable3 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/variables/basin_Name/'
        , body: {
            name: 'Basin_Name'
            , tags: []
            , description: ''
            , format: {}
            , max_chars: 15
            , alias: 'basin_Name'
            , header_order: 7
            , dataset_id: '123'
            , type: 'categorical'
            , id: '8877'
            , categories: [{
                    numeric_value: null
                    , id: 1
                    , name: 'Atchafalaya'
                }
                , {
                    numeric_value: null
                    , id: 2
                    , name: 'Barataria'
                }
                , {
                    numeric_value: null
                    , id: 3
                    , name: 'Calcasieu'
                }
                , {
                    numeric_value: null
                    , id: 4
                    , name: 'Outside Waters'
                }
                , {
                    numeric_value: null
                    , id: 5
                    , name: 'Pontchartrain'
                }
                , {
                    numeric_value: null
                    , id: 6
                    , name: 'Terrebonne'
                }
                , {
                    numeric_value: null
                    , id: 7
                    , name: 'Vermilion-Teche'
                }
            ]
            , view: {
                show_counts: false
                , show_numeric_values: false
                , column_width: 150
            }
        }
        , urls: {
            frequencies_url: '/api/datasets/123/variables/basin_Name/frequencies/'
            , summary_url: '/api/datasets/123/variables/basin_Name/summary/'
            , cast_url: '/api/datasets/123/variables/basin_Name/cast/'
            , values_url: '/api/datasets/123/variables/basin_Name/values/'
        }
        , specification: '/api/specifications/categorical_variables/'
        , description: 'Details for a given Variable'
    };
    var catVariable4 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/variables/basin_Name/'
        , body: {
            name: 'meh'
            , tags: []
            , description: ''
            , format: {}
            , max_chars: 15
            , alias: 'meh'
            , header_order: 7
            , dataset_id: '123'
            , type: 'categorical'
            , id: '8877'
            , categories: [{
                    id: '123'
                    , name: 'aa'
                    , numeric_value: 1
                    , missing: false
                }
                , {
                    id: '234'
                    , name: 'bb'
                    , numeric_value: 2
                    , missing: false
                }
                , {
                    id: '345'
                    , name: 'cc'
                    , numeric_value: 3
                    , missing: false
                }
                , {
                    id: '456'
                    , name: 'dd'
                    , numeric_value: 4
                    , missing: false
                }
                , {
                    id: '567'
                    , name: 'ee'
                    , numeric_value: 5
                    , missing: false
                }
                , {
                    id: '678'
                    , name: 'ff'
                    , numeric_value: 6
                    , missing: false
                }
            ]
            , view: {
                show_counts: false
                , show_numeric_values: false
                , column_width: 150
            }
        }
        , urls: {
            frequencies_url: '/api/datasets/123/variables/basin_Name/frequencies/'
            , summary_url: '/api/datasets/123/variables/basin_Name/summary/'
            , cast_url: '/api/datasets/123/variables/basin_Name/cast/'
            , values_url: '/api/datasets/123/variables/basin_Name/values/'
        }
        , specification: '/api/specifications/categorical_variables/'
        , description: 'Details for a given Variable'
    };
    var cat4Summary = {
        'count': '1000'
        ,'categories': [{
                'id': '0e113c244601ecba6296a0bb6fbfb53f'
                ,'count': 330
            }
            , {
                'id': '540192ea488fb24f758bb12404ab7004'
                ,'count': 392
            }
            , {
                'id': '70a8c2af4f59739d96029265564397b1'
                ,'count': 208
            }
            , {
                'id': 'f7fc88ccbde05411346bd9c4d563f10c'
                ,'count': 7
            }
            , {
                'id': 'd164624eadbaae8c6047c014fc0e4063'
                ,'count': 43
            }
            , {
                'id': '50277c27f2b030c033a88b6294f51fdf'
                ,'count': 20
            }
        ]
        ,'valid_count': 1000
        ,'missing_count': 0
    };
    var numVariable1 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/variables/mil_Time/'
        , body: {
            name: 'Mil_Time'
            , tags: ['b', 'c']
            , description: ''
            , format: {}
            , max_chars: 6
            , alias: 'mil_Time'
            , header_order: 2
            , dataset_id: '123'
            , type: 'numeric'
            , id: 'cdd8401011404fa98062c665b8f3f0de'
            , categories: []
            , view: {
                show_counts: false
                , show_numeric_values: true
                , column_width: 150
            }
        }
        , urls: {
            frequencies_url: '/api/datasets/123/variables/mil_Time/frequencies/'
            , summary_url: '/api/datasets/123/variables/mil_Time/summary/'
            , cast_url: '/api/datasets/123/variables/mil_Time/cast/'
            , values_url: '/api/datasets/123/variables/mil_Time/values/'
        }
        , specification: '/api/specifications/numeric_variables/'
        , description: 'Details for a given Variable'
    };
    var numVariable2 = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/variables/measure_Date/'
        , body: {
            name: 'Measure_Date'
            , tags: ['a']
            , description: ''
            , format: {}
            , max_chars: 10
            , alias: 'measure_Date'
            , header_order: 1
            , dataset_id: '123'
            , type: 'numeric'
            , id: '361974322d3a4464833aa03578f69b6c'
            , categories: []
            , view: {
                show_counts: false
                , show_numeric_values: true
                , column_width: 150
            }
        }
        , urls: {
            frequencies_url: '/api/datasets/123/variables/measure_Date/frequencies/'
            , summary_url: '/api/datasets/123/variables/measure_Date/summary/'
            , cast_url: '/api/datasets/123/variables/measure_Date/cast/'
            , values_url: '/api/datasets/123/variables/measure_Date/values/'
        }
        , specification: '/api/specifications/numeric_variables/'
        , description: 'Details for a given Variable'
    };
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
    var dataset123AllVariables = {
        total_Num: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/total_Num/'
            , body: {
                name: 'Total_Num'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 9
                , alias: 'total_Num'
                , header_order: 6
                , dataset_id: '123'
                , type: 'numeric'
                , id: 'f800f79653c144d8856de834bc16ff4f'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/total_Num/frequencies/'
                , summary_url: '/api/datasets/123/variables/total_Num/summary/'
                , cast_url: '/api/datasets/123/variables/total_Num/cast/'
                , values_url: '/api/datasets/123/variables/total_Num/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , measure_Date: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/measure_Date/'
            , body: {
                name: 'Measure_Date'
                , tags: ['a']
                , description: ''
                , format: {}
                , max_chars: 10
                , alias: 'measure_Date'
                , header_order: 1
                , dataset_id: '123'
                , type: 'numeric'
                , id: '3094acf1798f492bab1cab7e7f041a31'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/measure_Date/frequencies/'
                , summary_url: '/api/datasets/123/variables/measure_Date/summary/'
                , cast_url: '/api/datasets/123/variables/measure_Date/cast/'
                , values_url: '/api/datasets/123/variables/measure_Date/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , mm: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/mm/'
            , body: {
                name: 'MM'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 4
                , alias: 'mm'
                , header_order: 4
                , dataset_id: '123'
                , type: 'numeric'
                , id: '5b79a1527d5f45a1a685f763e4c41aea'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/mm/frequencies/'
                , summary_url: '/api/datasets/123/variables/mm/summary/'
                , cast_url: '/api/datasets/123/variables/mm/cast/'
                , values_url: '/api/datasets/123/variables/mm/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , dd: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/dd/'
            , body: {
                name: 'DD'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 4
                , alias: 'dd'
                , header_order: 5
                , dataset_id: '123'
                , type: 'numeric'
                , id: 'e17d0fe889c44a53b1d600684aebe29d'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/dd/frequencies/'
                , summary_url: '/api/datasets/123/variables/dd/summary/'
                , cast_url: '/api/datasets/123/variables/dd/cast/'
                , values_url: '/api/datasets/123/variables/dd/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , coordinateType: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/coordinateType/'
            , body: {
                name: 'Coordinate Type'
                , tags: ['a', 'c']
                , description: ''
                , format: {}
                , max_chars: 14
                , alias: 'coordinateType'
                , header_order: 12
                , dataset_id: '123'
                , type: 'categorical'
                , id: '9d6b70e3df6a4d5b8b6d4238ceabf5d0'
                , categories: [{
                        numeric_value: null
                        , id: 1
                        , name: 'Degree Min Sec'
                    }
                    , {
                        numeric_value: null
                        , id: 2
                        , name: 'Decimal Degree'
                    }
                ]
                , view: {
                    show_counts: false
                    , show_numeric_values: false
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/coordinateType/frequencies/'
                , summary_url: '/api/datasets/123/variables/coordinateType/summary/'
                , cast_url: '/api/datasets/123/variables/coordinateType/cast/'
                , values_url: '/api/datasets/123/variables/coordinateType/values/'
            }
            , specification: '/api/specifications/categorical_variables/'
            , description: 'Details for a given Variable'
        }
        , bow_Number: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/bow_Number/'
            , body: {
                name: 'BOW_Number'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 8
                , alias: 'bow_Number'
                , header_order: 9
                , dataset_id: '123'
                , type: 'numeric'
                , id: 'c2fbc11f396949ab9776eebe1e162740'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/bow_Number/frequencies/'
                , summary_url: '/api/datasets/123/variables/bow_Number/summary/'
                , cast_url: '/api/datasets/123/variables/bow_Number/cast/'
                , values_url: '/api/datasets/123/variables/bow_Number/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , yyyy: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/yyyy/'
            , body: {
                name: 'YYYY'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 6
                , alias: 'yyyy'
                , header_order: 3
                , dataset_id: '123'
                , type: 'numeric'
                , id: '7a4b609870dd400db520bb63f4937cdc'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/yyyy/frequencies/'
                , summary_url: '/api/datasets/123/variables/yyyy/summary/'
                , cast_url: '/api/datasets/123/variables/yyyy/cast/'
                , values_url: '/api/datasets/123/variables/yyyy/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , latitude: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/latitude/'
            , body: {
                name: 'Latitude'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 9
                , alias: 'latitude'
                , header_order: 10
                , dataset_id: '123'
                , type: 'numeric'
                , id: '041af41cc79d48e2b7288782152ebd15'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/latitude/frequencies/'
                , summary_url: '/api/datasets/123/variables/latitude/summary/'
                , cast_url: '/api/datasets/123/variables/latitude/cast/'
                , values_url: '/api/datasets/123/variables/latitude/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , longitude: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/longitude/'
            , body: {
                name: 'Longitude'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 9
                , alias: 'longitude'
                , header_order: 11
                , dataset_id: '123'
                , type: 'numeric'
                , id: '9924fc83be4f4704bfde27dfcea92227'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/longitude/frequencies/'
                , summary_url: '/api/datasets/123/variables/longitude/summary/'
                , cast_url: '/api/datasets/123/variables/longitude/cast/'
                , values_url: '/api/datasets/123/variables/longitude/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , bow_Af_Name: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/bow_Af_Name/'
            , body: {
                name: 'BOW_AF_Name'
                , tags: ['b']
                , description: ''
                , format: {}
                , max_chars: 39
                , alias: 'bow_Af_Name'
                , header_order: 8
                , dataset_id: '123'
                , type: 'categorical'
                , id: '4f134da57fae422d88ddffbdc180e53b'
                , categories: [{
                        numeric_value: null
                        , id: 1
                        , name: 'Atchafalaya Bay, Delta, Gulf waters'
                    }
                    , {
                        numeric_value: null
                        , id: 2
                        , name: 'Barataria Bay'
                    }
                    , {
                        numeric_value: null
                        , id: 3
                        , name: 'Calcasieu Lake'
                    }
                    , {
                        numeric_value: null
                        , id: 4
                        , name: 'Calcasieu River and Ship Channel'
                    }
                    , {
                        numeric_value: null
                        , id: 5
                        , name: 'Grid 12'
                    }
                    , {
                        numeric_value: null
                        , id: 6
                        , name: 'Grid 14'
                    }
                    , {
                        numeric_value: null
                        , id: 7
                        , name: 'Grid 15'
                    }
                    , {
                        numeric_value: null
                        , id: 8
                        , name: 'Grid 16'
                    }
                    , {
                        numeric_value: null
                        , id: 9
                        , name: 'California Bay and Breton Sound'
                    }
                    , {
                        numeric_value: null
                        , id: 10
                        , name: 'Lake Fortuna'
                    }
                    , {
                        numeric_value: null
                        , id: 11
                        , name: 'Lake Borgne'
                    }
                    , {
                        numeric_value: null
                        , id: 12
                        , name: 'Bays Gardene, Black, American and Crabe'
                    }
                    , {
                        numeric_value: null
                        , id: 13
                        , name: 'Lost Lake and Four League Bay'
                    }
                    , {
                        numeric_value: null
                        , id: 14
                        , name: 'Bayou Grand Caillou'
                    }
                    , {
                        numeric_value: null
                        , id: 15
                        , name: 'Bayou du Large'
                    }
                    , {
                        numeric_value: null
                        , id: 16
                        , name: 'Lake Barre'
                    }
                    , {
                        numeric_value: null
                        , id: 17
                        , name: 'Vermilion Bay'
                    }
                    , {
                        numeric_value: null
                        , id: 18
                        , name: 'East Cote Blanche Bay'
                    }
                ]
                , view: {
                    show_counts: false
                    , show_numeric_values: false
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/bow_Af_Name/frequencies/'
                , summary_url: '/api/datasets/123/variables/bow_Af_Name/summary/'
                , cast_url: '/api/datasets/123/variables/bow_Af_Name/cast/'
                , values_url: '/api/datasets/123/variables/bow_Af_Name/values/'
            }
            , specification: '/api/specifications/categorical_variables/'
            , description: 'Details for a given Variable'
        }
        , common_Name: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/common_Name/'
            , body: {
                name: 'Common_Name'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 14
                , alias: 'common_Name'
                , header_order: 0
                , dataset_id: '123'
                , type: 'categorical'
                , id: 'cd0632c3d34a4b479d7d8224351778b0'
                , categories: [{
                    numeric_value: null
                    , id: 1
                    , name: 'Eastern Oyster'
                }]
                , view: {
                    show_counts: false
                    , show_numeric_values: false
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/common_Name/frequencies/'
                , summary_url: '/api/datasets/123/variables/common_Name/summary/'
                , cast_url: '/api/datasets/123/variables/common_Name/cast/'
                , values_url: '/api/datasets/123/variables/common_Name/values/'
            }
            , specification: '/api/specifications/categorical_variables/'
            , description: 'Details for a given Variable'
        }
        , mil_Time: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/mil_Time/'
            , body: {
                name: 'Mil_Time'
                , tags: ['b', 'c', 'd']
                , description: ''
                , format: {}
                , max_chars: 6
                , alias: 'mil_Time'
                , header_order: 2
                , dataset_id: '123'
                , type: 'numeric'
                , id: '37ecd3325b9b487ab7a974bf0483d15e'
                , categories: []
                , view: {
                    show_counts: false
                    , show_numeric_values: true
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/mil_Time/frequencies/'
                , summary_url: '/api/datasets/123/variables/mil_Time/summary/'
                , cast_url: '/api/datasets/123/variables/mil_Time/cast/'
                , values_url: '/api/datasets/123/variables/mil_Time/values/'
            }
            , specification: '/api/specifications/numeric_variables/'
            , description: 'Details for a given Variable'
        }
        , basin_Name: {
            element: 'shoji:entity'
            , self: '/api/datasets/123/variables/basin_Name/'
            , body: {
                name: 'Basin_Name'
                , tags: []
                , description: ''
                , format: {}
                , max_chars: 15
                , alias: 'basin_Name'
                , header_order: 7
                , dataset_id: '123'
                , type: 'categorical'
                , id: '606dd9e70539456faa78d348d79df5a4'
                , categories: [{
                        numeric_value: null
                        , id: 1
                        , name: 'Atchafalaya'
                    }
                    , {
                        numeric_value: null
                        , id: 2
                        , name: 'Barataria'
                    }
                    , {
                        numeric_value: null
                        , id: 3
                        , name: 'Calcasieu'
                    }
                    , {
                        numeric_value: null
                        , id: 4
                        , name: 'Outside Waters'
                    }
                    , {
                        numeric_value: null
                        , id: 5
                        , name: 'Pontchartrain'
                    }
                    , {
                        numeric_value: null
                        , id: 6
                        , name: 'Terrebonne'
                    }
                    , {
                        numeric_value: null
                        , id: 7
                        , name: 'Vermilion-Teche'
                    }
                ]
                , view: {
                    show_counts: false
                    , show_numeric_values: false
                    , column_width: 150
                }
            }
            , urls: {
                frequencies_url: '/api/datasets/123/variables/basin_Name/frequencies/'
                , summary_url: '/api/datasets/123/variables/basin_Name/summary/'
                , cast_url: '/api/datasets/123/variables/basin_Name/cast/'
                , values_url: '/api/datasets/123/variables/basin_Name/values/'
            }
            , specification: '/api/specifications/categorical_variables/'
            , description: 'Details for a given Variable'
        }
    };
    var dataset123VariablesCatVariable1 = {
        element: 'shoji:catalog'
        , self: '/api/datasets/123/variables/'
        , specification: '/api/specifications/variables/'
        , description: 'List of Variables of this dataset'
        , entities: ['/api/datasets/123/variables/coordinateType/']
    };
    var dataset123Variables = {
        element: 'shoji:catalog'
        , self: '/api/datasets/123/variables/'
        , specification: '/api/specifications/variables/'
        , description: 'List of Variables of this dataset'
        , entities: ['/api/datasets/123/variables/measure_Date/', '/api/datasets/123/variables/mil_Time/', '/api/datasets/123/variables/basin_Name/', '/api/datasets/123/variables/bow_Af_Name/', '/api/datasets/123/variables/coordinateType/'
        ]
    };
    var user = {
        element: 'shoji:entity'
        , self: '/api/users/test_user/'
        , specification: '/api/specifications/users/'
        , description: 'Details for a User'
        , body: {
            first_name: 'Jean Luque'
            , last_name: 'Piccard'
            , email: 'email@host.test'
            , id: 'test_user'
        }
        , urls: {
            account_role_url: '/api/accounts/00001/user_roles/5181fc7307a7d81f41bbece1/'
            , invite_url: '/api/users/test_user/invite/'
            , password_reset_url: '/api/users/test_user/password_reset/'
            , account_url: '/api/accounts/00001/'
            , password_url: '/api/users/test_user/password/'
            , sources_url: '/api/users/test_user/sources/'
            , projects_url: '/api/users/test_user/projects/'
            , datasets_url: '/api/users/test_user/datasets/'
        }
    };
    var userDatasets = {
        element: 'shoji:catalog'
        , self: '/api/users/test_user/datasets/'
        , specification: '/api/specifications/datasets/'
        , description: 'List of Datasets that belong to this user. POST a Dataset representation (serialized JSON) here to create a new one; a 201 response indicates success and returns the location of the new object. GET that URL to retrieve the object.'
        , entities: ['/api/datasets/123/']
    };
    return {
        api: api
        , catVariable1: catVariable1
        , catVariable2: catVariable2
        , catVariable3: catVariable3
        , catVariable4: catVariable4
        , cat4Summary: cat4Summary
        , numVariable1: numVariable1
        , numVariable2: numVariable2
        , dataset123: dataset123
        , dataset123Variables: dataset123Variables
        , dataset123VariablesCatVariable1: dataset123VariablesCatVariable1
        , dataset123AllVariables: dataset123AllVariables
        , user: user
        , userDatasets: userDatasets
    }
})
    .call(this);