module.exports = (function() {
    'use strict';
    var dataset = {
        element: 'shoji:entity'
        ,self: '/api/datasets/123/'
        ,specification: '/api/specifications/datasets/'
        ,description: 'Detail for a given dataset'
        , body: {
            userid: 'test_user'
            ,name: 'oyster.csv'
            // comma after null for browserify
            ,row_names_variable: null, sources: ['51c685100f029130e2368b93']
            ,id: '123'
            ,categories: []
            ,description: ''
        }

        , urls: {
            filters_url: '/some/dataset/123/filters/'
            ,applied_filters_url: '/some/dataset/123/applied_filters/'
            ,redo_url: '/api/datasets/123/redo/'
            ,all_variables_url: '/api/datasets/123/all_variables/'
            ,table_url: '/api/datasets/123/table/'
            ,undo_url: '/api/datasets/123/undo/'
            ,sources_url: '/api/datasets/123/sources/'
            ,rows_url: '/api/datasets/123/rows/'
            ,variables_url: '/api/datasets/123/variables/'
            ,row_names_url: '/api/datasets/123/row_names/'
            ,actions_url: '/api/datasets/123/actions/'
            ,summary_url: '/api/datasets/123/summary/'
            ,users_url: '/api/datasets/123/users/'
            ,tags_list: '/api/datasets/123/tags_list/'
            ,analyze_url: '/api/datasets/123/analyze/'
            ,apply_analysis_url: "/apply/analysis/url/"
        }
    };
    /*
    var variable1 = {
        element: 'shoji:entity'
        ,self: '/api/datasets/123/variable1/'
    };
    var variable2 = {
        element: 'shoji:entity'
        ,self: '/api/datasets/123/variable2/'
    };
    var api = {
        element: 'shoji:entity'
        ,self: '/api/'
        ,description: 'The API root. GET user_url to access your Crunch resources. GET logout_url to sign out.'
        ,urls: {
            roles_url: '/api/roles/users/'
            ,logout_url: '/api/logout/'
            ,user_url: '/api/users/test_user/'
        }
    };
    var slide = {
        "element": "shoji:entity"
        ,"self": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/"
        ,"specification": "/api/specifications/user_datasets/"
        ,"description": "User view of a dataset"
        ,"body": {
            "archived": false
            ,"user_id": "00002"
            // comma after null for browserify
            ,"row_labels_variable": null, "weight": "/api/datasets/0324e4c77d664234b243b19b13132a95/variables/weight/"
            ,"sources": ["dae5b1e996514a20949ebda92f661aa4"]
            ,"description": ""
            ,"show_row_numbers": true
            ,"dataset_id": "0324e4c77d664234b243b19b13132a95"
            ,"id": "0324e4c77d664234b243b19b13132a95"
            ,"name": "ECON_Small.sav"}
            ,"urls": {"filters_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/filters/"
            ,"role_url": "/api/roles/datasets/528725b93bf09b3dbc59d1e5/"
            ,"grid_view_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/grid_view/"
            ,"dataset_url": "/api/datasets/0324e4c77d664234b243b19b13132a95/"
            ,"array_xtab_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/array_xtab/"
            ,"sources_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/sources/"
            ,"xtab_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/xtab/"
            ,"decks_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/decks/"
            ,"apply_analysis_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/apply_analysis/"
            ,"histogram_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/histogram/"
            ,"share_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/share/"
            ,"summary_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/summary/"
            ,"discarded_variables_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/discarded_variables/"
            ,"users_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/users/"
            ,"user_url": "/api/users/test_user/", "weight_variables_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/weight_variables/"
            ,"applied_exclusion_filters_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/applied_exclusion_filters/"
            ,"rows_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/rows/"
            ,"tags_list_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/tags_list/"
            ,"variables_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/variables/"
            ,"exclusion_filters_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/exclusion_filters/"
            ,"bind_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/bind/"
            ,"analyze_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/analyze/"
            ,"applied_filters_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/applied_filters/"
        }
    }
    var slideEntity = {
        "element": "shoji:entity"
        ,"self": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/decks/768bfc526f6e49f9acfda15c8a4456de/slides/80a3c6031b2b492c870938470ccccb60/"
        ,"description": "Returns the detail information for a given slide"
        ,"body": {
            "title": "Slide #1"
            ,"deck_id": "768bfc526f6e49f9acfda15c8a4456de"
            ,"id": "80a3c6031b2b492c870938470ccccb60"
        }
        ,"urls": {
            "analyses_url": "/api/users/test_user/datasets/47b0818d6a6a4d25b41006a885cd0a56/decks/768bfc526f6e49f9acfda15c8a4456de/slides/80a3c6031b2b492c870938470ccccb60/analyses/"
        }
    }
    */
    // /api/users/139/datasets/622/decks/cf6/slides/ef1/
    var slidesForDataset = {"element": "shoji:entity", "self": "/api/users/139/datasets/622/decks/cf6/slides/ef1/", "description": "Returns the detail information for a given slide", "body": {"deck_id": "cf6b7996e6944a57abaa50322f8034b4", "subtitle": "BOW_Number", "id": "ef15d2637481473e8f011d656ea8cf78", "title": "Coordinate Type"}, "urls": {"analyses_url": "/api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/"}}
    // /api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/
    var analysesForDataset = {"element": "shoji:catalog", "self": "/api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/", "specification": "/api/specifications/analyses/", "description": "List of all analyses inside this slide", "entities": ["/api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/e3b/"], "index": {"/api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/e3b/": {}}}
    // /api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/e3b/
    var anAnalysisForDataset = {"element": "shoji:entity", "self": "/api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/e3b/", "description": "Data to build a given analyses", "body": {"query_environment": {"weight_variable": null, "applied_filters": []}, "query_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/xtab/?variables_urls=https%3A%2F%2F%2Fapi%2Fdatasets%2F2648f5e4455642518bb9ba0e2d26e2be%2Fvariables%2FcoordinateType%2F%2Chttps%3A%2F%2F%2Fapi%2Fdatasets%2F2648f5e4455642518bb9ba0e2d26e2be%2Fvariables%2Fbow_Number%2F", "id": "e3b78b71fbd54a9ab97c6e2ef6cd28b5", "query": {
        dimensions:[
    {'variable': '/api/datasets/123/variables/admit'}
    ,{'variable': '/api/datasets/123/variables/gender'}
    ]
    ,measures:{'count': {'function': 'cube_count'}}}
, "display_settings": {"decimalPlaces": {"value": 2}, "percentageDirection": {"value": "cellPct"}, "countsOrPercents": {"value": "percent"}, "tableOrGraph": {"value": "graph"}, "valueBlockName": {"value": "values"}}, "dataset_id": "2648f5e4455642518bb9ba0e2d26e2be"}}
    // /api/users/139/datasets/622/apply_analysis/
    var somethingWeird4Times = {}
    // /api/datasets/2648f5e4455642518bb9ba0e2d26e2be/xtab/?variables_urls=https%3A%2F%2F%2Fapi%2Fdatasets%2F2648f5e4455642518bb9ba0e2d26e2be%2Fvariables%2FcoordinateType%2F%2Chttps%3A%2F%2F%2Fapi%2Fdatasets%2F2648f5e4455642518bb9ba0e2d26e2be%2Fvariables%2Fbow_Number%2F
    var variable1 = {"element": "shoji:view", "self": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/xtab/?variables_urls=https%3A%2F%2F%2Fapi%2Fdatasets%2F2648f5e4455642518bb9ba0e2d26e2be%2Fvariables%2FcoordinateType%2F%2Chttps%3A%2F%2F%2Fapi%2Fdatasets%2F2648f5e4455642518bb9ba0e2d26e2be%2Fvariables%2Fbow_Number%2F", "value": {"response": {"weighted": false, "subtitle": null, "input_variables": ["/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/", "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/"], "rowtitle": "Coordinate Type", "dataFrameTable": [{"count": 1592.0, "var1": "0.0 - 100000.0", "var0": "Degree Min Sec", "cellPct": 37.7430061640588, "colPct": 91.96995956094743, "rowPct": 39.493922103696356}, {"count": 1726.0, "var1": "100000.0 - 200000.0", "var0": "Degree Min Sec", "cellPct": 40.91986723565671, "colPct": 97.29425028184893, "rowPct": 42.818159265690895}, {"count": 0.0, "var1": "200000.0 - 300000.0", "var0": "Degree Min Sec", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "300000.0 - 400000.0", "var0": "Degree Min Sec", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "400000.0 - 500000.0", "var0": "Degree Min Sec", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "500000.0 - 600000.0", "var0": "Degree Min Sec", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "600000.0 - 700000.0", "var0": "Degree Min Sec", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "700000.0 - 800000.0", "var0": "Degree Min Sec", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "800000.0 - 900000.0", "var0": "Degree Min Sec", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 713.0, "var1": "900000.0 - 1000000.0", "var0": "Degree Min Sec", "cellPct": 16.903745851114273, "colPct": 100.0, "rowPct": 17.68791863061275}, {"count": 139.0, "var1": "0.0 - 100000.0", "var0": "Decimal Degree", "cellPct": 3.2954006638217166, "colPct": 8.03004043905257, "rowPct": 74.33155080213903}, {"count": 48.0, "var1": "100000.0 - 200000.0", "var0": "Decimal Degree", "cellPct": 1.1379800853485065, "colPct": 2.705749718151071, "rowPct": 25.668449197860966}, {"count": 0.0, "var1": "200000.0 - 300000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "300000.0 - 400000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "400000.0 - 500000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "500000.0 - 600000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "600000.0 - 700000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "700000.0 - 800000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "800000.0 - 900000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}, {"count": 0.0, "var1": "900000.0 - 1000000.0", "var0": "Decimal Degree", "cellPct": 0.0, "colPct": 0.0, "rowPct": 0.0}], "table": {"values": {"count": [[1592.0, 139.0], [1726.0, 48.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [713.0, 0.0]], "colPct": [[91.96995956094743, 8.03004043905257], [97.29425028184893, 2.705749718151071], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [100.0, 0.0]], "cellPct": [[37.7430061640588, 3.2954006638217166], [40.91986723565671, 1.1379800853485065], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [16.903745851114273, 0.0]], "rowlabels": ["Degree Min Sec", "Decimal Degree"], "orient": "col", "rowPct": [[39.493922103696356, 74.33155080213903], [42.818159265690895, 25.668449197860966], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [17.68791863061275, 0.0]]}}, "collabels": [["0.0 - 100000.0", "100000.0 - 200000.0", "200000.0 - 300000.0", "300000.0 - 400000.0", "400000.0 - 500000.0", "500000.0 - 600000.0", "600000.0 - 700000.0", "700000.0 - 800000.0", "800000.0 - 900000.0", "900000.0 - 1000000.0"]], "valid_count": 4218.0, "margincols": {"labels": ["All", "Valid"], "values": {"count": [[95.56661925082977, 4031.0], [4.433380749170223, 187.0]], "colPct": [[95.56661925082977, 4031.0], [4.433380749170223, 187.0]], "cellPct": [[95.56661925082977, 4031.0], [4.433380749170223, 187.0]], "rowPct": [[100, 4031.0], [100, 187.0]]}, "orient": "row"}, "coltitles": ["BOW_Number"], "title": "Coordinate Type", "missing_count": 0.0, "marginrows": {"labels": ["All", "Valid"], "values": {"count": [[41.038406827880515, 42.05784732100521, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.903745851114273], [1731.0, 1774.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 713.0]], "colPct": [[100, 100, 100, 100, 100, 100, 100, 100, 100, 100], [1731.0, 1774.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 713.0]], "cellPct": [[41.038406827880515, 42.05784732100521, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.903745851114273], [1731.0, 1774.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 713.0]], "rowPct": [[41.038406827880515, 42.05784732100521, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.903745851114273], [1731.0, 1774.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 713.0]]}, "orient": "row"}, "displayType": {"valueKey": "count", "graph": "barchart", "format": {"digits": 2, "variables": {}}}}, "analysis": {"query": {"function": "xtab", "named_args": {"variables": ["1ae5271965a7455a99601beee90b61a9", "9a58c21ddf4741f19c17531fef348f92"]}}, "dataset_id": "2648f5e4455642518bb9ba0e2d26e2be", "query_environment": {"weight_variable": null, "applied_filters": []}}}}
    // /api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/
    var variable1resolve = {"element": "shoji:entity", "self": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/", "body": {"name": "Coordinate Type", "format": {"summary": {"digits": 2}}, "tags": [], "missing_reasons": {}, "discarded": false, "alias": "coordinateType", "categories": [{"numeric_value": null, "id": 1, "name": "Degree Min Sec", "missing": false}, {"numeric_value": null, "missing": false, "id": 2, "name": "Decimal Degree"}], "dataset_id": "2648f5e4455642518bb9ba0e2d26e2be", "view": {"show_counts": false, "show_numeric_values": false, "include_missing": false, "column_width": null}, "type": "categorical", "id": "1ae5271965a7455a99601beee90b61a9", "header_order": 12, "description": null}, "urls": {"summary_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/summary/", "cast_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/cast/", "missing_rules_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/missing_rules/", "dataset_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/", "frequencies_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/frequencies/", "view_model_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/card_view/", "values_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/coordinateType/values/"}, "specification": "/api/specifications/categorical_variables/", "description": "Details for a given Variable"}
    // /api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/
    var variable2resolve = {"element": "shoji:entity", "self": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/", "body": {"name": "BOW_Number", "format": {"data": {"digits": 2}, "summary": {"digits": 2}}, "tags": [], "missing_reasons": {"No Data": -1}, "discarded": false, "alias": "bow_Number", "categories": [], "dataset_id": "2648f5e4455642518bb9ba0e2d26e2be", "view": {"column_width": null}, "type": "numeric", "id": "9a58c21ddf4741f19c17531fef348f92", "header_order": 9, "description": null}, "urls": {"summary_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/summary/", "cast_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/cast/", "missing_rules_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/missing_rules/", "dataset_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/", "frequencies_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/frequencies/", "view_model_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/card_view/", "values_url": "/api/datasets/2648f5e4455642518bb9ba0e2d26e2be/variables/bow_Number/values/"}, "specification": "/api/specifications/numeric_variables/", "description": "Details for a given Variable"}
    var cube2x2 = {'element': 'shoji:view', 'self': 'queryurl',
            'value':{
            'description': 'A Crunch Cube of data for this dataset.',
            'query': {
                'filters': [],
                'weight' : undefined
            },
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

    return {
        //api: api
        dataset: dataset
        ,slidesForDataset: slidesForDataset
        ,analysesForDataset: analysesForDataset
        ,anAnalysisForDataset: anAnalysisForDataset
        ,somethingWeird4Times: somethingWeird4Times
        ,variable1: variable1 //MLM: TODO: rename this
        ,variable1resolve: variable1resolve
        ,variable2resolve: variable2resolve
        ,cube2x2: cube2x2
    }
})
    .call(this);
