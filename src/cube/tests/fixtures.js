'use strict';
module.exports = Fixtures.call(this)

function Fixtures(){
    var query = {
        dimensions:[
            {'variable': '/api/datasets/123/variables/admit'}
            ,{'variable': '/api/datasets/123/variables/gender'}
        ]
        ,measures:{'count': {'function': 'cube_count'}}
    }

    var categoricalCount = {'element': 'shoji:view',
 'self': '/api/datasets/123/cube/?query='
    + encodeURIComponent(JSON.stringify(query)),
 'value': {'filters': [],
            'description': 'A Crunch Cube of data for this dataset.',
            'result': {'dimensions': [{'derived': false,
                                         'references': {'alias': 'Admit',
                                                         'discarded': false,
                                                         'header_order': 0,
                                                         'name': 'Admit'},
                                         'type': {'categories': [{'id': 1,
                                                                    'missing': false,
                                                                    'name': 'Admitted',
                                                                    'numeric_value': undefined},
                                                                   {'id': 2,
                                                                    'missing': false,
                                                                    'name': 'Rejected',
                                                                    'numeric_value': undefined}],
                                                   'class': 'categorical',
                                                   'ordinal': false}},
                                        {'derived': false,
                                         'references': {'alias': 'Dept',
                                                         'discarded': false,
                                                         'header_order': 2,
                                                         'name': 'Dept'},
                                         'type': {'categories': [{'id': 1,
                                                                    'missing': false,
                                                                    'name': 'A',
                                                                    'numeric_value': undefined},
                                                                   {'id': 2,
                                                                    'missing': false,
                                                                    'name': 'B',
                                                                    'numeric_value': undefined},
                                                                   {'id': 3,
                                                                    'missing': false,
                                                                    'name': 'C',
                                                                    'numeric_value': undefined},
                                                                   {'id': 4,
                                                                    'missing': false,
                                                                    'name': 'D',
                                                                    'numeric_value': undefined},
                                                                   {'id': 5,
                                                                    'missing': false,
                                                                    'name': 'E',
                                                                    'numeric_value': undefined},
                                                                   {'id': 6,
                                                                    'missing': false,
                                                                    'name': 'F',
                                                                    'numeric_value': undefined}],
                                                   'class': 'categorical',
                                                   'ordinal': false}}],
                        'element': 'crunch:cube',
                        'measures': {'count': {'n_missing': 0, 'data': [601,
                                                           370,
                                                           322,
                                                           269,
                                                           147,
                                                           46,
                                                           332,
                                                           215,
                                                           596,
                                                           523,
                                                           437,
                                                           668],
                                                 'metadata': {'derived': true,
                                                               'references': {},
                                                               'type': {'class': 'numeric',
                                                                         'integer': true,
                                                                         'missing_reasons': {'No Data': -1},
                                                                         'missing_rules': {}}}}},
                        'n': 4526},
            'margins': {
                '0': {'data': [1755, 2771]},
                '1': {'data': [933, 585, 918, 792, 584, 714]},
                'data': [4526]
            },
            'sources': [{'variable': '/api/datasets/123/variables/admit/'},
                         {'variable': '/api/datasets/123/variables/dept/'}]}}

    var count3d = {'element': 'shoji:view',
 'self': '/api/datasets/123/cube/?query=q',
 'value': {'filters': [],
            'description': 'A Crunch Cube of data for this dataset.',
            'result': {'dimensions': [{'derived': false,
                                         'references': {'alias': 'Admit',
                                                         'discarded': false,
                                                         'header_order': 0,
                                                         'name': 'Admit'},
                                         'type': {'categories': [{'id': 1,
                                                                    'missing': false,
                                                                    'name': 'Admitted',
                                                                    'numeric_value': undefined},
                                                                   {'id': 2,
                                                                    'missing': false,
                                                                    'name': 'Rejected',
                                                                    'numeric_value': undefined}],
                                                   'class': 'categorical',
                                                   'ordinal': false}},
                                        {'derived': false,
                                         'references': {'alias': 'Dept',
                                                         'discarded': false,
                                                         'header_order': 2,
                                                         'name': 'Dept'},
                                         'type': {'categories': [{'id': 1,
                                                                    'missing': false,
                                                                    'name': 'A',
                                                                    'numeric_value': undefined},
                                                                   {'id': 2,
                                                                    'missing': false,
                                                                    'name': 'B',
                                                                    'numeric_value': undefined},
                                                                   {'id': 3,
                                                                    'missing': false,
                                                                    'name': 'C',
                                                                    'numeric_value': undefined},
                                                                   {'id': 4,
                                                                    'missing': false,
                                                                    'name': 'D',
                                                                    'numeric_value': undefined},
                                                                   {'id': 5,
                                                                    'missing': false,
                                                                    'name': 'E',
                                                                    'numeric_value': undefined},
                                                                   {'id': 6,
                                                                    'missing': false,
                                                                    'name': 'F',
                                                                    'numeric_value': undefined}],
                                                   'class': 'categorical',
                                                   'ordinal': false}},
                                        {'derived': false,
                                         'references': {'alias': 'Gender',
                                                         'discarded': false,
                                                         'header_order': 1,
                                                         'name': 'Gender'},
                                         'type': {'categories': [{'id': 1,
                                                                    'missing': false,
                                                                    'name': 'Male',
                                                                    'numeric_value': undefined},
                                                                   {'id': 2,
                                                                    'missing': false,
                                                                    'name': 'Female',
                                                                    'numeric_value': undefined}],
                                                   'class': 'categorical',
                                                   'ordinal': false}}],
                        'element': 'crunch:cube',
                        'measures': {'count': {'n_missing': 0, 'data': [512,
                                                           89,
                                                           353,
                                                           17,
                                                           120,
                                                           202,
                                                           138,
                                                           131,
                                                           53,
                                                           94,
                                                           22,
                                                           24,
                                                           313,
                                                           19,
                                                           207,
                                                           8,
                                                           205,
                                                           391,
                                                           279,
                                                           244,
                                                           138,
                                                           299,
                                                           351,
                                                           317],
                                                 'metadata': {'derived': true,
                                                               'references': {},
                                                               'type': {'class': 'numeric',
                                                                         'integer': true,
                                                                         'missing_reasons': {'No Data': -1},
                                                                         'missing_rules': {}}}}},
                        'n': 4526},
            'margins':{
                '1': {
                    '0': {'data': [
                        [601, 370, 322, 269, 147, 46],
                        [332, 215, 596, 523, 437, 668]]},
                    '2': {'data': [
                        [825, 108], [560, 25], [325, 593],
                        [417, 375], [191, 393], [373, 341]]},
                    'data': [933, 585, 918, 792, 584, 714]},
                '0': {
                    '1': {'data': [
                        [601, 370, 322, 269, 147, 46],
                        [332, 215, 596, 523, 437, 668]]},
                    '2': {'data': [[1198, 557], [1493, 1278]]},
                    'data': [1755, 2771]},
                '2': {
                    '1': {'data': [
                        [825, 108], [560, 25], [325, 593],
                        [417, 375], [191, 393], [373, 341]]},
                    '0': {'data': [[1198, 557], [1493, 1278]]},
                    'data': [2691, 1835]},
                'data': [4526]
            },
            'sources': [{'variable': '/api/datasets/123/variables/admit/'},
                         {'variable': '/api/datasets/123/variables/dept/'},
                         {'variable': '/api/datasets/123/variables/gender/'}]}}

    // Munge cube2by2 into xtab2by2:
    var cube2x2 = {'element': 'shoji:view', 'self': 'queryurl',
            'value':{
            'description': 'A Crunch Cube of data for this dataset.',
            'filters': [],
            'result': {
                'element': 'crunch:cube',
                'measures': {'count': {
                    'data': [1198, 557, 1493, 1278],
                    'metadata': {
                        'derived': true, 'references': {},
                        'type': {'integer': true, 'missing_rules': {},
                        'class': 'numeric', 'missing_reasons': {'No Data': -1}}}}
                },
                'dimensions': [
                    {'derived': false,
                    'references': {
                        'discarded': false, 'alias': 'Admit',
                        'name': 'Admit', 'header_order': 0
                    },
                    'type': {'ordinal': false, 'class': 'categorical',
                    'categories': [
                        {'numeric_value': undefined, 'missing': false,
                        'id': 1, 'name': 'Admitted'},
                        {'numeric_value': undefined, 'missing': false,
                        'id': 2, 'name': 'Rejected'}
                    ]}},
                    {'derived': false,
                    'references': {
                        'discarded': false, 'alias': 'Gender',
                        'name': 'Gender', 'header_order': 1
                    },
                    'type': {'ordinal': false, 'class': 'categorical',
                    'categories': [
                        {'numeric_value': undefined, 'missing': false,
                        'id': 1, 'name': 'Male'},
                        {'numeric_value': undefined, 'missing': false,
                        'id': 2, 'name': 'Female'}]
                }}],
                'n': 4526
            },
            'margins': {
                '0': {'data': [1755, 2771]},
                '1': {'data': [2691, 1835]},
                'data': [4526]
            },
            'sources': [{'variable': '/api/datasets/123/variables/admit/'},
                         {'variable': '/api/datasets/123/variables/gender/'}]
        }
    }
    var xtab2x2 = {
        'weighted': false
        ,'subtitle': 'subtitle'
        ,'rowtitle': 'Admit'
        ,'table': {
            'values': {
                'count': [
                    [
                        1198, 1493
                    ], [
                        557, 1278
                    ]
                ]
                ,'colPct': [
                    [
                        44.518766257896694, 55.481233742103306
                    ], [
                        30.354223433242506, 69.64577656675749
                    ]
                ]
                ,'cellPct': [
                    [
                        26.469288555015467, 32.9871851524525
                    ], [
                        12.306672558550597, 28.236853733981444
                    ]
                ]
                ,'rowlabels': ['Admitted', 'Rejected']
                ,'orient': 'col'
                ,'rowPct': [
                    [
                        68.26210826210827, 53.87946589678816
                    ], [
                        31.737891737891736, 46.12053410321184
                    ]
                ]
            }
        }
        ,'collabels': [
            ['Male', 'Female']
        ]
        ,'valid_count': 4526
        ,'margincols': {
            'labels': ['All', 'Valid']
            ,'values': [
                [
                    38.77596111356606, 61.22403888643394
                ], [
                    1755, 2771
                ]
            ]
            ,'orient': 'col'
        }
        ,'coltitles': ['Gender']
        ,'title': 'Admit'
        ,'missing_count': 0
        ,'dataFrameTable':[
          {
            "var0": "Admitted",
            "var1": "Male",
            "count": 1198,
            "colPct": 44.518766257896694,
            "cellPct": 26.469288555015467,
            "rowPct": 68.26210826210827,
            "count_weighted": 1198,
            "colPct_weighted": 44.518766257896694,
            "cellPct_weighted": 26.469288555015467,
            "rowPct_weighted": 68.26210826210827
          },
          {
            "var0": "Admitted",
            "var1": "Female",
            "count": 557,
            "colPct": 30.354223433242506,
            "cellPct": 12.306672558550597,
            "rowPct": 31.737891737891736,
            "count_weighted": 557,
            "colPct_weighted": 30.354223433242506,
            "cellPct_weighted": 12.306672558550597,
            "rowPct_weighted": 31.737891737891736
          },
          {
            "var0": "Rejected",
            "var1": "Male",
            "count": 1493,
            "colPct": 55.481233742103306,
            "cellPct": 32.9871851524525,
            "rowPct": 53.87946589678816,
            "count_weighted": 1493,
            "colPct_weighted": 55.481233742103306,
            "cellPct_weighted": 32.9871851524525,
            "rowPct_weighted": 53.87946589678816
          },
          {
            "var0": "Rejected",
            "var1": "Female",
            "count": 1278,
            "colPct": 69.64577656675749,
            "cellPct": 28.236853733981444,
            "rowPct": 46.12053410321184,
            "count_weighted": 1278,
            "colPct_weighted": 69.64577656675749,
            "cellPct_weighted": 28.236853733981444,
            "rowPct_weighted": 46.12053410321184
          }
        ]
        ,'marginrows': {
            'labels': ['All', 'Valid']
            ,'values': [
                [
                    59.456473707467964, 40.543526292532036
                ], [
                    2691, 1835
                ]
            ]
            ,'orient': 'row'
        }
        ,'displayType': {
            'valueKey': 'count'
            ,'graph': 'barchart'
            ,'format': {
                'digits': 2
            }
        }
    }

    var dataset = {
        element: 'shoji:entity'
        , self: '/api/datasets/123/'
        , specification: '/api/specifications/datasets/'
        , description: 'Detail for a given dataset'
        , body: {
            userid: 'test_user'
            , name: 'oyster.csv'
            , row_names_variable: null
            , sources: ['51c685100f029130e2368b93']
            , id: '123'
            , categories: []
            , description: ''
        }
        , urls: {
            filters_url: '/some/dataset/123/filters/'
            , applied_filters_url: '/some/dataset/123/applied_filters/'
            , redo_url: '/api/datasets/123/redo/'
            , all_variables_url: '/api/datasets/123/all_variables/'
            , table_url: '/api/datasets/123/table/'
            , undo_url: '/api/datasets/123/undo/'
            , sources_url: '/api/datasets/123/sources/'
            , rows_url: '/api/datasets/123/rows/'
            , variables_url: '/api/datasets/123/variables/'
            , row_names_url: '/api/datasets/123/row_names/'
            , actions_url: '/api/datasets/123/actions/'
            , summary_url: '/api/datasets/123/summary/'
            , users_url: '/api/datasets/123/users/'
            , tags_list: '/api/datasets/123/tags_list/'
            , analyze_url: '/api/datasets/123/analyze/'
            , cube_url: '/api/datasets/123/cube/'
        }
    }
    var cube1d = {"element": "shoji:view", "self": "/api/datasets/8aed476b31474552882e3c2e45565857/cube/?query=%7B%22dimensions%22:%5B%7B%22variable%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F8aed476b31474552882e3c2e45565857%2Fvariables%2Ffc0540c0a2574758ad191e40bf804474%2F%22%7D%5D,%22measures%22:%7B%22count%22:%7B%22function%22:%22cube_count%22,%22args%22:%5B%5D%7D%7D%7D", "value": {"sources": [{"variable": "/api/datasets/8aed476b31474552882e3c2e45565857/variables/fc0540c0a2574758ad191e40bf804474/"}], "margins": {"data": [1000]}, "filters": [], "description": "A Crunch Cube of data for this dataset.", "result": {"element": "crunch:cube", "measures": {'count': {'n_missing': 0, 'data': [490, 510], "metadata": {"references": {}, "derived": true, "type": {"integer": true, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "dimensions": [{"references": {"description": "Are you male or female?", "name": "Gender", "format": null, "dichotomous": false, "discarded": false, "alias": "gender_v0", "is_subvar": null, "header_order": null, "view": null}, "derived": false, "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": 1, "missing": false, "id": 1, "name": "Male"}, {"numeric_value": 2, "missing": false, "id": 2, "name": "Female"}]}}], "n": 1000}}}
    var xtab1d = {"element": "shoji:view", "self": "/api/datasets/8aed476b31474552882e3c2e45565857/analyze/?variables_urls=https:%2F%2F%2Fapi%2Fdatasets%2F8aed476b31474552882e3c2e45565857%2Fvariables%2Ffc0540c0a2574758ad191e40bf804474%2F", "value": {"response": {"weighted": false, "subtitle": "Are you male or female?", "input_variables": ["/api/datasets/8aed476b31474552882e3c2e45565857/variables/fc0540c0a2574758ad191e40bf804474/"], "rowtitle": "Gender", "dataFrameTable": [
        {"count": 490.0, "var1": "", "var0": "Male", "cellPct": 49.0, "rowPct": 100.0, "colPct": 49.0}, {"count": 510.0, "var1": "", "var0": "Female", "cellPct": 51.0, "rowPct": 100.0, "colPct": 51.0}], "table": {"values": {"count": [[490.0, 510.0]], "colPct": [[49.0, 51.0]], "cellPct": [[49.0, 51.0]], "rowlabels": ["Male", "Female"], "orient": "col", "rowPct": [[100.0, 100.0]]}}, "collabels": [[""]], "valid_count": 1000.0, "margincols": null, "coltitles": ["Value"], "title": "Gender", "missing_count": 0.0, "marginrows": {"values": {"count": [[100.0], [1000.0]], "labels": ["All (%)", "Valid"], "colPct": [[100.0], [1000.0]], "cellPct": [[100.0], [1000.0]], "rowPct": [[100.0], [1000.0]]}, "orient": "row"}, "displayType": {"valueKey": "count", "graph": "barchart", "format": {"digits": 2, "variables": {}}}}, "analysis": {"query": {"function": "xtab", "named_args": {"variables": ["/api/datasets/8aed476b31474552882e3c2e45565857/variables/fc0540c0a2574758ad191e40bf804474/"]}}, "query_environment": {"filters": [], "weight": null}}}}

    var categoricalArrayCube = {'self': 'http://127.0.0.1:5051/api/datasets/ff2b3138dfaa424b8294a47342b034e3/cube/?query=%7B%22measures%22%3A+%7B%22count%22%3A+%7B%22function%22%3A+%22cube_count%22%7D%7D%2C+%22dimensions%22%3A+%5B%7B%22each%22%3A+%22http%3A%2F%2F127.0.0.1%3A5051%2Fapi%2Fdatasets%2Fff2b3138dfaa424b8294a47342b034e3%2Fvariables%2F3d683f9a207e4e78bb69d468aa306fc6%2F%22%7D%2C+%7B%22variable%22%3A+%22http%3A%2F%2F127.0.0.1%3A5051%2Fapi%2Fdatasets%2Fff2b3138dfaa424b8294a47342b034e3%2Fvariables%2F3d683f9a207e4e78bb69d468aa306fc6%2F%22%7D%5D%7D', 'value': {'sources': [{'each': 'http://127.0.0.1:5051/api/datasets/ff2b3138dfaa424b8294a47342b034e3/variables/3d683f9a207e4e78bb69d468aa306fc6/'}, {'variable': 'http://127.0.0.1:5051/api/datasets/ff2b3138dfaa424b8294a47342b034e3/variables/3d683f9a207e4e78bb69d468aa306fc6/'}], 'margins': {'1': {'data': [7, 5]}, '0': {'data': [4, 4, 4]}, 'data': [12]}, 'filters': [], 'description': 'A Crunch Cube of data for this dataset.', 'result': {
        'n': 4, 'measures': {'count': {'n_missing': 0, 'data': [1, 3, 3, 1, 3, 1], 'metadata': {'derived': true, 'references': {}, 'type': {'integer': true, 'missing_rules': {}, 'class': 'numeric', 'missing_reasons': {'No Data': -1}}}}}, 'dimensions': [
        {'derived': true, 'references': {'discarded': false, 'alias': 'ca1', 'name': 'V', 'header_order': 3, 'view': {'show_counts': false, 'show_numeric_values': false, 'include_missing': false, 'column_width': undefined}},
        'type': {'subtype': {'class': 'variable'}, 'elements': [
        {'value': {'references': {'name': 'A', 'discarded': false, 'alias': 'A', 'is_subvar': true, 'header_order': 3, 'view': {'show_counts': false, 'show_numeric_values': false, 'include_missing': false, 'column_width': undefined}}, 'derived': false, 'id': '2f3093dae7ab4d20bb427cfc972ced78', 'type': {'ordinal': false, 'class': 'categorical', 'categories': [{'numeric_value': 0.0, 'id': 1, 'name': '0.0', 'missing': false}, {'numeric_value': 1.0, 'id': 2, 'name': '1.0', 'missing': false}]}}, 'id': 1, 'missing': false},
        {'value': {'references': {'name': 'B', 'discarded': false, 'alias': 'B', 'is_subvar': true, 'header_order': 4, 'view': {'show_counts': false, 'show_numeric_values': false, 'include_missing': false, 'column_width': undefined}}, 'derived': false, 'id': '5f667e9e4f0d464bad62b72fdd19510c', 'type': {'ordinal': false, 'class': 'categorical', 'categories': [{'numeric_value': 0.0, 'missing': false, 'id': 1, 'name': '0.0'}, {'numeric_value': 1.0, 'missing': false, 'id': 2, 'name': '1.0'}]}}, 'id': 2, 'missing': false},
        {'value': {'references': {'name': 'C', 'discarded': false, 'alias': 'C', 'is_subvar': true, 'header_order': 5, 'view': {'show_counts': false, 'show_numeric_values': false, 'include_missing': false, 'column_width': undefined}}, 'derived': false, 'id': '20036a6384894c59a4389f9d1f7366d7', 'type': {'ordinal': false, 'class': 'categorical', 'categories': [{'numeric_value': 0.0, 'missing': false, 'id': 1, 'name': '0.0'}, {'numeric_value': 1.0, 'missing': false, 'id': 2, 'name': '1.0'}]}}, 'id': 3, 'missing': false}],
        'class': 'enum'}},
        {'derived': true, 'references': {'discarded': false, 'alias': 'ca1', 'name': 'V', 'header_order': 3, 'view': {'show_counts': false, 'show_numeric_values': false, 'include_missing': false, 'column_width': undefined}}, 'type': {'ordinal': false, 'matrix': ['2f3093dae7ab4d20bb427cfc972ced78', '5f667e9e4f0d464bad62b72fdd19510c', '20036a6384894c59a4389f9d1f7366d7'], 'categories': [
        {'numeric_value': 0.0, 'id': 1, 'name': '0.0', 'missing': false},
        {'numeric_value': 1.0, 'id': 2, 'name': '1.0', 'missing': false}],
        'class': 'categorical'}}], 'element': 'crunch:cube'}}, 'element': 'shoji:view'
    }

    var categoricalArrayXtab = {'all_valid': 4,
                            'any_missing': 0,
                            'categoryColumns': [{'id': 1,
                                                  'missing': false,
                                                  'name': '0.0',
                                                  'numeric_value': 0.0},
                                                 {'id': 2,
                                                  'missing': false,
                                                  'name': '1.0',
                                                  'numeric_value': 1.0}],
                            'collabels': [['0.0', '1.0']],
                            'coltitles': [''],
                            'dataFrameTable': [{'colPct': 25.0,
                                                 'count': 1.0,
                                                 'var0': 'A',
                                                 'var1': '0.0'},
                                                {'colPct': 75.0,
                                                 'count': 3.0,
                                                 'var0': 'A',
                                                 'var1': '1.0'},
                                                {'colPct': 75.0,
                                                 'count': 3.0,
                                                 'var0': 'B',
                                                 'var1': '0.0'},
                                                {'colPct': 25.0,
                                                 'count': 1.0,
                                                 'var0': 'B',
                                                 'var1': '1.0'},
                                                {'colPct': 75.0,
                                                 'count': 3.0,
                                                 'var0': 'C',
                                                 'var1': '0.0'},
                                                {'colPct': 25.0,
                                                 'count': 1.0,
                                                 'var0': 'C',
                                                 'var1': '1.0'}],
                            'displayType': {'format': {'digits': 2,
                                                         'variables': {}},
                                             'graph': 'barchart',
                                             'valueKey': 'count'},
                            'input_variables': ['http://127.0.0.1:5051/api/datasets/1b932bb295274ac580237dc26c9723e2/variables/1b8fc375c2f041d9868f2f57e8d6b316/'],
                            'margincols': [],
                            'marginrows': [],
                            'missing_count': 0,
                            'rowtitle': 'V',
                            'subtitle': '',
                            'table': {'values': {'colPct': [[25,75,75]
                                                            [75,25,25]],
                                                   'count': [[1,3,3]
                                                            ,[3,1,1]],
                                                   'orient': 'col',
                                                   'rowlabels': ['A',
                                                                  'B',
                                                                  'C']}},
                            'title': 'V',
                            'valid_count': 4,
                            'weighted': false
    }
    var arrayWithMissing = {"element": "shoji:view", "self": "/api/datasets/4664ae489c2940e696368267d7a65ad7/cube/?query=%7B%22dimensions%22:%5B%7B%22each%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F4664ae489c2940e696368267d7a65ad7%2Fvariables%2F54cbdcf06dc840f7a2f3e70a1b16ec27%2F%22%7D,%7B%22variable%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F4664ae489c2940e696368267d7a65ad7%2Fvariables%2F54cbdcf06dc840f7a2f3e70a1b16ec27%2F%22%7D%5D,%22measures%22:%7B%22count%22:%7B%22function%22:%22cube_count%22%7D%7D%7D", "value": {"sources": [{"each": "/api/datasets/4664ae489c2940e696368267d7a65ad7/variables/54cbdcf06dc840f7a2f3e70a1b16ec27/"}, {"variable": "/api/datasets/4664ae489c2940e696368267d7a65ad7/variables/54cbdcf06dc840f7a2f3e70a1b16ec27/"}], "margins": {"0": {"data": [4, 4]}, "1": {"data": [4, 2, 2]}, "data": [8]}, "filters": [], "description": "A Crunch Cube of data for this dataset.", "result": {"element": "crunch:cube", "measures": {'count': {'n_missing': 1, 'data': [2, 1, 1, 2, 1, 1], "metadata": {"references": {}, "derived": true, "type": {"integer": true, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "dimensions": [{"references": {"description": "", "name": "arr", "format": {"summary": {"digits": 2}}, "dichotomous": true, "discarded": false, "alias": "arr", "is_subvar": false, "header_order": 1, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}}, "derived": true, "type": {"subtype": {"class": "variable"}, "elements": [{"value": {"derived": false, "references": {"description": "", "format": {"summary": {"digits": 2}}, "dichotomous": true, "discarded": false, "alias": "Y", "is_subvar": true, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}, "header_order": 1, "name": " (1)"}, "id": "93bb37df967b4596997a61f6eb1dfacb", "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": 0, "missing": false, "id": 0, "name": "0"}, {"numeric_value": 1, "missing": false, "id": 1, "name": "1"}, {"numeric_value": null, "missing": true, "id": -1, "name": "No Data"}]}}, "id": 1, "missing": false}, {"value": {"derived": false, "references": {"description": "", "format": {"summary": {"digits": 2}}, "dichotomous": true, "discarded": false, "alias": "Z", "is_subvar": true, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}, "header_order": 2, "name": " (2)"}, "id": "a1d43f771962465082aa2d8700176f42", "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": 0, "missing": false, "id": 0, "name": "0"}, {"numeric_value": 1, "missing": false, "id": 1, "name": "1"}, {"numeric_value": null, "missing": true, "id": -1, "name": "No Data"}]}}, "id": 2, "missing": false}], "class": "enum"}}, {"references": {"description": "", "format": {"summary": {"digits": 2}}, "dichotomous": true, "discarded": false, "alias": "arr", "is_subvar": false, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}, "header_order": 1, "name": "arr"}, "derived": true, "type": {"ordinal": false, "matrix": ["93bb37df967b4596997a61f6eb1dfacb", "a1d43f771962465082aa2d8700176f42"], "categories": [{"numeric_value": 0, "missing": false, "id": 0, "name": "0"}, {"numeric_value": 1, "missing": false, "id": 1, "name": "1"}, {"numeric_value": null, "missing": true, "id": -1, "name": "No Data"}], "class": "categorical"}}], "n": 4, "missing": 1}}}
    var numericEnum = {"element": "shoji:view", "self": "http://local.crunch.io:8080/api/datasets/6f9f9438cf3d4007bf6bd6d9cd48b47f/cube/?query=%7B%22dimensions%22:%5B%7B%22function%22:%22bin%22,%22args%22:%5B%7B%22variable%22:%22http:%2F%2Flocal.crunch.io:8080%2Fapi%2Fdatasets%2F6f9f9438cf3d4007bf6bd6d9cd48b47f%2Fvariables%2F54dfad401d5842f6be048a95c711ffaa%2F%22%7D%5D%7D%5D,%22measures%22:%7B%22count%22:%7B%22function%22:%22cube_count%22%7D%7D%7D", "value": {"sources": [{"function": "bin", "args": [{"variable": "http://local.crunch.io:8080/api/datasets/6f9f9438cf3d4007bf6bd6d9cd48b47f/variables/54dfad401d5842f6be048a95c711ffaa/"}]}], "margins": {"data": [6]}, "filters": [], "description": "A Crunch Cube of data for this dataset.", "result": {"element": "crunch:cube", "measures": {'count': {'n_missing': 0, 'data': [4, 1, 0, 0, 0, 1], "metadata": {"references": {}, "derived": true, "type": {"integer": true, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "dimensions": [{"references": {"discarded": false, "alias": "z", "name": "z", "header_order": 2, "description": "Numberic variable with missing value range"}, "derived": false, "type": {"elements": [{"id": -1, "value": {"?": -1}, "missing": true}, {"id": 1, "value": [1.0, 1.5], "missing": false}, {"id": 2, "value": [1.5, 2.0], "missing": false}, {"id": 3, "value": [2.0, 2.5], "missing": false}, {"id": 4, "value": [2.5, 3.0], "missing": false}, {"id": 5, "value": [3.0, 3.5], "missing": false}], "class": "enum"}}], "missing": 4, "n": 6}}}
    var datetimeUnivariate = {"element": "shoji:view", "self": "/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/cube/?query={%22dimensions%22:[{%22function%22:%22rollup%22,%22args%22:[{%22variable%22:%22/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/variables/9cbe3c8ed7a54d2ebee5c243e840737d/%22},{%22value%22:%20%22M%22}]}],%22measures%22:{%22count%22:{%22function%22:%22cube_count%22}}}", "value": {"sources": [{"function": "rollup", "args": [{"variable": "/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/variables/9cbe3c8ed7a54d2ebee5c243e840737d/"}, {"value": "M"}]}], "margins": {"data": [562043.0542529402]}, "filters": [], "description": "A Crunch Cube of data for this dataset.", "result": {"element": "crunch:cube", "measures": {'count': {'n_missing': 0, 'data': [3999.999999999988, 999.9999999999903, 4001.000000000035, 5026.000000000041, 5008.000000000002, 5007.0000000000355, 3114.000000000037, 9071.999999999905, 8627.999999999767, 9315.000000000004, 9252.000000000022, 8582.999999999944, 9272.000000000151, 9316.00000000006, 9251.999999999834, 9295.000000000007, 9192.000000000038, 10281.999999999873, 10085.000000000062, 10222.999999999964, 10181.054252941636, 11140.000000000182, 12115.999999999913, 20084.99999999888, 14079.99999999999, 15066.0000000006, 20024.99999999929, 16122.999999999842, 16132.000000000617, 14027.00000000044, 10039.000000000053, 10999.99999999934, 1000.0000000000026, 24999.999999999065, 40999.99999999939, 33000.00000000064, 15026.000000000127, 22000.000000000076, 26000.00000000266, 24999.999999999094, 24999.999999999913, 13579.999999999825, 1500.00000000001, 14999.999999998794], "metadata": {"references": {}, "derived": true, "type": {"integer": false, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "dimensions": [{"references": {"description": "", "name": "Wave", "format": {"data": "%B %Y", "summary": "%b %Y"}, "dichotomous": false, "discarded": false, "alias": "Wave", "is_subvar": null, "header_order": null, "view": {"rollup_resolution": "M", "resolution": "D", "column_width": null}}, "derived": true, "type": {"subtype": {"missing_rules": {}, "resolution": "M", "class": "datetime", "missing_reasons": {"No Data": -1}}, "elements": [{"id": 0, "value": "2009-05", "missing": false}, {"id": 1, "value": "2009-06", "missing": false}, {"id": 2, "value": "2009-07", "missing": false}, {"id": 3, "value": "2009-09", "missing": false}, {"id": 4, "value": "2009-10", "missing": false}, {"id": 5, "value": "2009-11", "missing": false}, {"id": 6, "value": "2009-12", "missing": false}, {"id": 7, "value": "2010-01", "missing": false}, {"id": 8, "value": "2010-02", "missing": false}, {"id": 9, "value": "2010-03", "missing": false}, {"id": 10, "value": "2010-04", "missing": false}, {"id": 11, "value": "2010-05", "missing": false}, {"id": 12, "value": "2010-06", "missing": false}, {"id": 13, "value": "2010-07", "missing": false}, {"id": 14, "value": "2010-08", "missing": false}, {"id": 15, "value": "2010-09", "missing": false}, {"id": 16, "value": "2010-10", "missing": false}, {"id": 17, "value": "2010-11", "missing": false}, {"id": 18, "value": "2010-12", "missing": false}, {"id": 19, "value": "2011-01", "missing": false}, {"id": 20, "value": "2011-02", "missing": false}, {"id": 21, "value": "2011-03", "missing": false}, {"id": 22, "value": "2011-04", "missing": false}, {"id": 23, "value": "2011-05", "missing": false}, {"id": 24, "value": "2011-06", "missing": false}, {"id": 25, "value": "2011-07", "missing": false}, {"id": 26, "value": "2011-08", "missing": false}, {"id": 27, "value": "2011-09", "missing": false}, {"id": 28, "value": "2011-10", "missing": false}, {"id": 29, "value": "2011-11", "missing": false}, {"id": 30, "value": "2011-12", "missing": false}, {"id": 31, "value": "2012-01", "missing": false}, {"id": 32, "value": "2012-02", "missing": false}, {"id": 33, "value": "2012-03", "missing": false}, {"id": 34, "value": "2012-06", "missing": false}, {"id": 35, "value": "2012-08", "missing": false}, {"id": 36, "value": "2012-10", "missing": false}, {"id": 37, "value": "2012-11", "missing": false}, {"id": 38, "value": "2013-02", "missing": false}, {"id": 39, "value": "2013-06", "missing": false}, {"id": 40, "value": "2013-08", "missing": false}, {"id": 41, "value": "2014-02", "missing": false}, {"id": 42, "value": "2014-03", "missing": false}, {"id": 43, "value": "2014-05", "missing": false}], "class": "enum"}}], "missing": 0, "n": 562043}}}
    var datetimeCat = {"element": "shoji:view", "self": "/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/cube/?query={%22dimensions%22:[{%22function%22:%22rollup%22,%22args%22:[{%22variable%22:%22/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/variables/9cbe3c8ed7a54d2ebee5c243e840737d/%22},{%22value%22:%20%22M%22}]},{%22variable%22:%22/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/variables/7f14bb08d57c4c3aa655427d0f7120d4/%22}],%22measures%22:{%22count%22:{%22function%22:%22cube_count%22}}}", "value": {"sources": [{"function": "rollup", "args": [{"variable": "/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/variables/9cbe3c8ed7a54d2ebee5c243e840737d/"}, {"value": "M"}]}, {"variable": "/api/datasets/63fe72a5f0504e7786cdb2b9db58c399/variables/7f14bb08d57c4c3aa655427d0f7120d4/"}], "margins": {"0": {"data": [4000.0000000000364, 999.999999999998, 4000.9999999999627, 5025.999999999964, 5007.9999999999745, 5007.00000000002, 3113.999999999967, 9071.999999999844, 8628.000000000171, 9315.000000000118, 9252.00000000007, 8583.000000000025, 9271.999999999887, 9315.99999999992, 9252.000000000065, 9295.000000000151, 9191.999999999993, 10282.00000000004, 10084.999999999904, 10222.999999999935, 10181.054252941987, 11140.00000000007, 12116.000000000284, 20084.999999999658, 14079.99999999969, 15065.999999999836, 20024.999999999854, 16122.999999999874, 16131.999999999545, 14027.000000000082, 10039.000000000093, 10999.999999999894, 999.9999999999991, 25000.000000001688, 40999.99999999982, 33000.00000000032, 15026.000000000011, 21999.999999999814, 26000.000000000025, 24999.999999999465, 24999.999999999556, 13580.000000000031, 1499.9999999999945, 15000.00000000043]}, "1": {"data": [287074.9673848985, 274968.0868680436]}, "data": [562043.054252942]}, "filters": [], "description": "A Crunch Cube of data for this dataset.", "result": {"element": "crunch:cube", "measures": {'count': {'n_missing': 0, 'data': [1983.8349880292535, 2016.1650119707826, 452.6315789473669, 547.3684210526311, 1984.3940727259921, 2016.6059272739703, 2473.0856070520827, 2552.914392947881, 2492.3910563276177, 2515.6089436723564, 2450.358598426494, 2556.641401573526, 1548.1241744272822, 1565.8758255726846, 4472.079289388511, 4599.920710611332, 4259.456991775145, 4368.543008225025, 4587.931167895574, 4727.0688321045445, 4554.517883413273, 4697.482116586797, 4207.419881925234, 4375.58011807479, 4543.58797688109, 4728.412023118798, 4572.347952044853, 4743.652047955067, 4528.03778096888, 4723.962219031187, 4569.017352831542, 4725.982647168609, 4547.754102800616, 4644.245897199377, 5183.599296468616, 5098.400703531424, 5047.870308362863, 5037.12969163704, 5125.856832598573, 5097.143167401361, 5083.103187284149, 5097.951065657838, 5570.416476998968, 5569.583523001101, 6014.47363400986, 6101.526365990424, 10521.902710899058, 9563.0972891006, 7065.109696780736, 7014.8903032189555, 7657.547830082054, 7408.452169917782, 10537.125356578925, 9487.874643420928, 8189.593712399452, 7933.406287600423, 8166.6199023715035, 7965.380097628043, 7435.411783214131, 6591.588216785951, 5103.946222343203, 4935.05377765689, 5933.856441778875, 5066.14355822102, 514.909743806804, 485.090256193195, 13141.88071188502, 11858.119288116666, 21987.34148978892, 19012.6585102109, 17327.76407249122, 15672.2359275091, 7631.195967950961, 7394.80403204905, 11726.84249439372, 10273.157505606094, 13237.616328725555, 12762.38367127447, 12660.295173688903, 12339.704826310563, 12727.826358347704, 12272.173641651854, 6846.874732612069, 6733.125267387962, 840.7451305523541, 659.2548694476405, 7568.271332623454, 7431.728667376974], "metadata": {"references": {}, "derived": true, "type": {"integer": false, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "dimensions": [{"references": {"description": "", "name": "Wave", "format": {"data": "%B %Y", "summary": "%b %Y"}, "dichotomous": false, "discarded": false, "alias": "Wave", "is_subvar": null, "header_order": null, "view": {"rollup_resolution": "M", "resolution": "D", "column_width": null}}, "derived": true, "type": {"subtype": {"missing_rules": {}, "resolution": "M", "class": "datetime", "missing_reasons": {"No Data": -1}}, "elements": [{"id": 0, "value": "2009-05", "missing": false}, {"id": 1, "value": "2009-06", "missing": false}, {"id": 2, "value": "2009-07", "missing": false}, {"id": 3, "value": "2009-09", "missing": false}, {"id": 4, "value": "2009-10", "missing": false}, {"id": 5, "value": "2009-11", "missing": false}, {"id": 6, "value": "2009-12", "missing": false}, {"id": 7, "value": "2010-01", "missing": false}, {"id": 8, "value": "2010-02", "missing": false}, {"id": 9, "value": "2010-03", "missing": false}, {"id": 10, "value": "2010-04", "missing": false}, {"id": 11, "value": "2010-05", "missing": false}, {"id": 12, "value": "2010-06", "missing": false}, {"id": 13, "value": "2010-07", "missing": false}, {"id": 14, "value": "2010-08", "missing": false}, {"id": 15, "value": "2010-09", "missing": false}, {"id": 16, "value": "2010-10", "missing": false}, {"id": 17, "value": "2010-11", "missing": false}, {"id": 18, "value": "2010-12", "missing": false}, {"id": 19, "value": "2011-01", "missing": false}, {"id": 20, "value": "2011-02", "missing": false}, {"id": 21, "value": "2011-03", "missing": false}, {"id": 22, "value": "2011-04", "missing": false}, {"id": 23, "value": "2011-05", "missing": false}, {"id": 24, "value": "2011-06", "missing": false}, {"id": 25, "value": "2011-07", "missing": false}, {"id": 26, "value": "2011-08", "missing": false}, {"id": 27, "value": "2011-09", "missing": false}, {"id": 28, "value": "2011-10", "missing": false}, {"id": 29, "value": "2011-11", "missing": false}, {"id": 30, "value": "2011-12", "missing": false}, {"id": 31, "value": "2012-01", "missing": false}, {"id": 32, "value": "2012-02", "missing": false}, {"id": 33, "value": "2012-03", "missing": false}, {"id": 34, "value": "2012-06", "missing": false}, {"id": 35, "value": "2012-08", "missing": false}, {"id": 36, "value": "2012-10", "missing": false}, {"id": 37, "value": "2012-11", "missing": false}, {"id": 38, "value": "2013-02", "missing": false}, {"id": 39, "value": "2013-06", "missing": false}, {"id": 40, "value": "2013-08", "missing": false}, {"id": 41, "value": "2014-02", "missing": false}, {"id": 42, "value": "2014-03", "missing": false}, {"id": 43, "value": "2014-05", "missing": false}], "class": "enum"}}, {"references": {"description": "Are you male or female?", "format": null, "dichotomous": false, "discarded": false, "alias": "gender", "is_subvar": null, "view": null, "header_order": null, "name": "Gender"}, "derived": false, "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": 1, "missing": false, "id": 1, "name": "Male"}, {"numeric_value": 2, "missing": false, "id": 2, "name": "Female"}]}}], "missing": 0, "n": 562043}}}
    var mean = {'self': 'http://127.0.0.1:5051/api/datasets/42e98ed4888e433d8990be098e6b4b12/cube/?query=%7B%22measures%22%3A+%7B%22stddev%22%3A+%7B%22function%22%3A+%22cube_stddev%22%2C+%22args%22%3A+%5B%7B%22variable%22%3A+%22http%3A%2F%2F127.0.0.1%3A5051%2Fapi%2Fdatasets%2F42e98ed4888e433d8990be098e6b4b12%2Fvariables%2F1b0c654436504e5ea4b2e725bfdf8cf4%2F%22%7D%5D%7D%2C+%22mean%22%3A+%7B%22function%22%3A+%22cube_mean%22%2C+%22args%22%3A+%5B%7B%22variable%22%3A+%22http%3A%2F%2F127.0.0.1%3A5051%2Fapi%2Fdatasets%2F42e98ed4888e433d8990be098e6b4b12%2Fvariables%2F1b0c654436504e5ea4b2e725bfdf8cf4%2F%22%7D%5D%7D%7D%7D', 'value': {'description': 'A Crunch Cube of data for this dataset.', 'sources': undefined, 'filters': [], 'result': {'n': 4, 'measures': {'stddev': {'data': [17.114808402861737], 'n_missing': 0, 'metadata': {'derived': true, 'references': {}, 'type': {'integer': undefined, 'missing_rules': {}, 'class': 'numeric', 'missing_reasons': {'No Data': -1}}}}, 'mean': {'data': [2557.75], 'n_missing': 0, 'metadata': {'derived': true, 'references': {}, 'type': {'integer': undefined, 'missing_rules': {}, 'class': 'numeric', 'missing_reasons': {'No Data': -1}}}}}, 'dimensions': [], 'missing': 0, 'element': 'crunch:cube'}, 'weight_url': undefined, 'margins': undefined}, 'element': 'shoji:view'}
    var meanCategorical = {'self': 'http://127.0.0.1:5051/api/datasets/e57fc68f62b747b09171aaeaedb701d7/cube/?query=%7B%22measures%22%3A+%7B%22stddev%22%3A+%7B%22function%22%3A+%22cube_stddev%22%2C+%22args%22%3A+%5B%7B%22variable%22%3A+%22http%3A%2F%2F127.0.0.1%3A5051%2Fapi%2Fdatasets%2Fe57fc68f62b747b09171aaeaedb701d7%2Fvariables%2F649c702d64f847ab9a5ad64def650860%2F%22%7D%5D%7D%2C+%22mean%22%3A+%7B%22function%22%3A+%22cube_mean%22%2C+%22args%22%3A+%5B%7B%22variable%22%3A+%22http%3A%2F%2F127.0.0.1%3A5051%2Fapi%2Fdatasets%2Fe57fc68f62b747b09171aaeaedb701d7%2Fvariables%2F649c702d64f847ab9a5ad64def650860%2F%22%7D%5D%7D%7D%2C+%22dimensions%22%3A+%5B%7B%22variable%22%3A+%22http%3A%2F%2F127.0.0.1%3A5051%2Fapi%2Fdatasets%2Fe57fc68f62b747b09171aaeaedb701d7%2Fvariables%2Fd68be76c7c3143e4a44d3ac64b2e525c%2F%22%7D%5D%7D', 'value': {'description': 'A Crunch Cube of data for this dataset.', 'sources': [{'variable': 'http://127.0.0.1:5051/api/datasets/e57fc68f62b747b09171aaeaedb701d7/variables/d68be76c7c3143e4a44d3ac64b2e525c/'}], 'filters': [], 'result': {'n': 4, 'measures': {'stddev': {'data': [{'?': -8}, {'?': -8}, {'?': -8}, {'?': -8}], 'n_missing': 0, 'metadata': {'derived': true, 'references': {}, 'type': {'integer': undefined, 'missing_rules': {}, 'class': 'numeric', 'missing_reasons': {'No Data': -1}}}}, 'mean': {'data': [2557.0, 2563.0, 2535.0, 2576.0], 'n_missing': 0, 'metadata': {'derived': true, 'references': {}, 'type': {'integer': undefined, 'missing_rules': {}, 'class': 'numeric', 'missing_reasons': {'No Data': -1}}}}}, 'dimensions': [{'derived': true, 'references': {'discarded': false, 'alias': ' Provincia', 'name': ' Provincia', 'header_order': 1}, 'type': {'subtype': {'missing_rules': {}, 'missing_reasons': {'No Data': -1}, 'class': 'text'}, 'elements': [{'id': 0, 'value': ' Bagua ', 'missing': false}, {'id': 1, 'value': ' Bongara ', 'missing': false}, {'id': 2, 'value': ' Chachapoyas ', 'missing': false}, {'id': 3, 'value': ' Condorcanqui ', 'missing': false}], 'class': 'enum'}}], 'missing': 0, 'element': 'crunch:cube'}, 'weight_url': undefined, 'margins': undefined}, 'element': 'shoji:view'}
    var multipleResponse1d = {"element": "shoji:view", "self": "/api/datasets/2d23c8f3899146eaafd5fa88e6b1aa6b/cube/?query=%7B%22dimensions%22:%5B%7B%22function%22:%22selected_array%22,%22args%22:%5B%7B%22variable%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F2d23c8f3899146eaafd5fa88e6b1aa6b%2Fvariables%2Fcb4d74b92b7748b6a51d61438e511cf6%2F%22%7D%5D%7D,%7B%22each%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F2d23c8f3899146eaafd5fa88e6b1aa6b%2Fvariables%2Fcb4d74b92b7748b6a51d61438e511cf6%2F%22%7D%5D,%22measures%22:%7B%22count%22:%7B%22function%22:%22cube_count%22%7D%7D%7D", "value": {"sources": [{"function": "selected_array", "args": [{"variable": "/api/datasets/2d23c8f3899146eaafd5fa88e6b1aa6b/variables/cb4d74b92b7748b6a51d61438e511cf6/"}]}, {"each": "/api/datasets/2d23c8f3899146eaafd5fa88e6b1aa6b/variables/cb4d74b92b7748b6a51d61438e511cf6/"}], "filters": [], "description": "A Crunch Cube of data for this dataset.", "weight_url": null, "margins": {"data": [4]}, "result": {"element": "crunch:cube", "measures": {"count": {"data": [1, 0, 0, 0, 3, 1], "n_missing": 0, "metadata": {"references": {}, "derived": true, "type": {"integer": true, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "dimensions": [{"references": {"discarded": false, "alias": "MR", "name": "MR", "header_order": 3, "description": ""}, "derived": true, "type": {"subtype": {"class": "variable"}, "elements": [{"value": {"derived": false, "references": {"name": "A", "discarded": false, "alias": "A", "is_subvar": true, "header_order": 3, "description": ""}, "id": "b332a08bf30641dca73e90485ce2b9c6", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 1, "missing": false}, {"value": {"derived": false, "references": {"name": "B", "discarded": false, "alias": "B", "is_subvar": true, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}, "header_order": 4, "description": ""}, "id": "27d1dccfaa5f41b3bd594d5fd97b145a", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 2, "missing": false}, {"value": {"derived": false, "references": {"name": "C", "discarded": false, "alias": "C", "is_subvar": true, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}, "header_order": 5, "description": ""}, "id": "f259bf78f20c42b2a91ca6e050089298", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 3, "missing": false}, {"value": null, "id": -1, "missing": true}, {"value": {"derived": true, "references": {}, "id": "__none__", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": -127, "missing": false}, {"value": {"derived": true, "references": {}, "id": "__any__", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 0, "missing": false}], "class": "enum"}}], "missing": 0, "n": 4}}}
    var multipleResponseCategorical = {"element": "shoji:view", "self": "/api/datasets/2d23c8f3899146eaafd5fa88e6b1aa6b/cube/?query=%7B%22dimensions%22:%5B%7B%22function%22:%22selected_array%22,%22args%22:%5B%7B%22variable%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F2d23c8f3899146eaafd5fa88e6b1aa6b%2Fvariables%2Fcb4d74b92b7748b6a51d61438e511cf6%2F%22%7D%5D%7D,%7B%22each%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F2d23c8f3899146eaafd5fa88e6b1aa6b%2Fvariables%2Fcb4d74b92b7748b6a51d61438e511cf6%2F%22%7D,%7B%22variable%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F2d23c8f3899146eaafd5fa88e6b1aa6b%2Fvariables%2F25b797bd86f9485a8faf5aee8f2b315e%2F%22%7D%5D,%22measures%22:%7B%22count%22:%7B%22function%22:%22cube_count%22%7D%7D%7D", "value": {"sources": [{"function": "selected_array", "args": [{"variable": "/api/datasets/2d23c8f3899146eaafd5fa88e6b1aa6b/variables/cb4d74b92b7748b6a51d61438e511cf6/"}]}, {"each": "/api/datasets/2d23c8f3899146eaafd5fa88e6b1aa6b/variables/cb4d74b92b7748b6a51d61438e511cf6/"}, {"variable": "/api/datasets/2d23c8f3899146eaafd5fa88e6b1aa6b/variables/25b797bd86f9485a8faf5aee8f2b315e/"}], "filters": [], "description": "A Crunch Cube of data for this dataset.", "weight_url": null, "margins": {"0": {"data": [1, 0, 0, 0, 3, 1]}, "1": {"data": [2, 2]}, "data": [4]}, "result": {"element": "crunch:cube", "measures": {"count": {"data": [0, 1, 0, 0, 0, 0, 0, 0, 2, 1, 0, 1], "n_missing": 0, "metadata": {"references": {}, "derived": true, "type": {"integer": true, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "dimensions": [{"references": {"discarded": false, "alias": "MR", "name": "MR", "header_order": 3, "description": ""}, "derived": true, "type": {"subtype": {"class": "variable"}, "elements": [{"value": {"derived": false, "references": {"name": "A", "discarded": false, "alias": "A", "is_subvar": true, "header_order": 3, "description": ""}, "id": "b332a08bf30641dca73e90485ce2b9c6", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 1, "missing": false}, {"value": {"derived": false, "references": {"name": "B", "discarded": false, "alias": "B", "is_subvar": true, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}, "header_order": 4, "description": ""}, "id": "27d1dccfaa5f41b3bd594d5fd97b145a", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 2, "missing": false}, {"value": {"derived": false, "references": {"name": "C", "discarded": false, "alias": "C", "is_subvar": true, "view": {"show_counts": false, "column_width": null, "include_missing": false, "show_numeric_values": false}, "header_order": 5, "description": ""}, "id": "f259bf78f20c42b2a91ca6e050089298", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 3, "missing": false}, {"value": null, "id": -1, "missing": true}, {"value": {"derived": true, "references": {}, "id": "__none__", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": -127, "missing": false}, {"value": {"derived": true, "references": {}, "id": "__any__", "type": {"missing_rules": {}, "missing_reasons": {"No Data": -1}, "class": "boolean"}}, "id": 0, "missing": false}], "class": "enum"}}, {"references": {"discarded": false, "alias": "pet", "name": "pet", "header_order": 7, "description": ""}, "derived": false, "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": null, "missing": false, "id": 1, "name": "dog"}, {"numeric_value": null, "missing": false, "id": 2, "name": "cat"}]}}], "missing": 0, "n": 4}}}

    var statsTestCube = {'element': 'shoji:view',
 'self': '/api/datasets/123/cube/?query='
    + encodeURIComponent(JSON.stringify(query)),
 'value': {'filters': [],
            'description': 'A Crunch Cube of data for this dataset.',
            'result': {'dimensions': [{'derived': false,
                                         'references': {'alias': 'Admit',
                                                         'discarded': false,
                                                         'header_order': 0,
                                                         'name': 'Admit'},
                                         'type': {'categories': [{'id': 1,
                                                                    'missing': false,
                                                                    'name': 'Admitted',
                                                                    'numeric_value': undefined},
                                                                   {'id': 2,
                                                                    'missing': false,
                                                                    'name': 'Rejected',
                                                                    'numeric_value': undefined}],
                                                   'class': 'categorical',
                                                   'ordinal': false}},
                                        {'derived': false,
                                         'references': {'alias': 'Dept',
                                                         'discarded': false,
                                                         'header_order': 2,
                                                         'name': 'Dept'},
                                         'type': {'categories': [{'id': 1,
                                                                    'missing': false,
                                                                    'name': 'A',
                                                                    'numeric_value': undefined},
                                                                   {'id': 2,
                                                                    'missing': false,
                                                                    'name': 'B',
                                                                    'numeric_value': undefined},
                                                                   {'id': 3,
                                                                    'missing': false,
                                                                    'name': 'C',
                                                                    'numeric_value': undefined},
                                                                   {'id': 4,
                                                                    'missing': false,
                                                                    'name': 'D',
                                                                    'numeric_value': undefined},
                                                                   {'id': 5,
                                                                    'missing': false,
                                                                    'name': 'E',
                                                                    'numeric_value': undefined},
                                                                   {'id': 6,
                                                                    'missing': false,
                                                                    'name': 'F',
                                                                    'numeric_value': undefined}],
                                                   'class': 'categorical',
                                                   'ordinal': false}}],
                        'element': 'crunch:cube',
                        'measures': {'count': {'n_missing': 0, 'data': [18, 90,185,  81,  71 , 76, 7,  45, 146 , 79,  73, 129],
                                                 'metadata': {'derived': true,
                                                               'references': {},
                                                               'type': {'class': 'numeric',
                                                                         'integer': true,
                                                                         'missing_reasons': {'No Data': -1},
                                                                         'missing_rules': {}}}}},
                        'n': 1000},
            'margins': {
                '0': {'data': [521, 479 ]},
                '1': {'data': [18,  90, 185,  81,  71,  76 ]},
                'data': [1000]
            },
            'sources': [{'variable': '/api/datasets/123/variables/admit/'},
                         {'variable': '/api/datasets/123/variables/dept/'}]}}
    var admitXgender =
{"element": "shoji:view", "self": "/api/datasets/964b88a857d84531a24cd2aea37ce807/cube/?query=%7B%22dimensions%22:%5B%7B%22variable%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F964b88a857d84531a24cd2aea37ce807%2Fvariables%2Fba7f79713dbe4d9dab41568c43a11e2c%22%7D,%7B%22variable%22:%22https:%2F%2F%2Fapi%2Fdatasets%2F964b88a857d84531a24cd2aea37ce807%2Fvariables%2Fb0b3f914749a4ef4b0c3941cb6793f02%22%7D%5D,%22measures%22:%7B%22count%22:%7B%22function%22:%22cube_count%22,%22args%22:%5B%5D%7D%7D%7D", "value": {"query": {"measures": {"count": {"function": "cube_count", "args": []}}, "weight": "/api/datasets/964b88a857d84531a24cd2aea37ce807/variables/a48e2e9c38444825b6739464a89951aa/", "dimensions": [{"variable": "/api/datasets/964b88a857d84531a24cd2aea37ce807/variables/ba7f79713dbe4d9dab41568c43a11e2c"}, {"variable": "/api/datasets/964b88a857d84531a24cd2aea37ce807/variables/b0b3f914749a4ef4b0c3941cb6793f02"}], "filters": []}, "result": {"dimensions": [{"references": {"discarded": false, "alias": "Admit", "name": "Admit", "header_order": 0}, "derived": false, "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": null, "id": 1, "name": "Admitted", "missing": false}, {"numeric_value": null, "id": 2, "name": "Rejected", "missing": false}]}}, {"references": {"discarded": false, "alias": "Gender", "name": "Gender", "header_order": 1}, "derived": false, "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": null, "id": 1, "name": "Male", "missing": false}, {"numeric_value": null, "id": 2, "name": "Female", "missing": false}]}}], "missing": 45, "measures": {"count": {"data": [1169.7863186983059, 547.0152580585578, 1473.809547706473, 1261.3443143399054], "n_missing": 45, "metadata": {"references": {}, "derived": true, "type": {"integer": false, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "element": "crunch:cube", "margins": {"0": {"data": [1716.8015767568636, 2735.1538620463784]}, "1": {"data": [2643.595866404779, 1808.3595723984631]}, "data": [4451.955438803242]}, "n": 4526}}}

    return {
        categoricalCount: categoricalCount
        ,count3d: count3d
        ,cube2x2: cube2x2
        ,xtab2x2: xtab2x2
        ,cube1d: cube1d
        ,xtab1d: xtab1d
        ,categoricalArrayCube: categoricalArrayCube
        ,categoricalArrayXtab: categoricalArrayXtab
        ,arrayWithMissing: arrayWithMissing
        ,numericEnum: numericEnum
        ,datetimeUnivariate: datetimeUnivariate
        ,datetimeCat: datetimeCat
        ,mean: mean
        ,meanCategorical: meanCategorical
        ,multipleResponse1d: multipleResponse1d
        ,multipleResponseCategorical: multipleResponseCategorical
        ,query: query
        ,dataset: dataset
        ,statsTestCube: statsTestCube
        ,admitXgender: admitXgender
    }
}
