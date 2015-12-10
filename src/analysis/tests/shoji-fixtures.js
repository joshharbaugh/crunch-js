module.exports = (function() {
    'use strict';
    // /api/users/139/datasets/622/decks/cf6/slides/ef1/
    var slidesForDataset = {"element": "shoji:entity", "self": "/api/users/139/datasets/622/decks/cf6/slides/ef1/", "description": "Returns the detail information for a given slide", "body": {"deck_id": "cf6b7996e6944a57abaa50322f8034b4", "subtitle": "BOW_Number", "id": "ef15d2637481473e8f011d656ea8cf78", "title": "Coordinate Type"}, "catalogs": {"analyses": "/api/users/139/datasets/622/decks/cf6/slides/ef1/analyses/"}}
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
        slidesForDataset: slidesForDataset
        ,analysesForDataset: analysesForDataset
        ,anAnalysisForDataset: anAnalysisForDataset
        ,somethingWeird4Times: somethingWeird4Times
        ,variable1resolve: variable1resolve
        ,variable2resolve: variable2resolve
        ,cube2x2: cube2x2
    }
})
    .call(this);
