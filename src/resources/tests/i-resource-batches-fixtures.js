'use strict'

var datasetURL = 'http://localhost:8080/api/datasets/1/'
var datasetBatchesURL = 'http://localhost:8080/api/datasets/1/batches/'

var datasetResponse = {
    element: 'shoji:entity'
    , description: 'nothing'
    , self: datasetURL
    , catalogs: {
        batches: datasetBatchesURL
    }
    , urls : {
        batches: datasetBatchesURL
    }
}

var batchesResponse = {
    'index': {
        'http://localhost:8080/api/datasets/1/batches/2/': {
            'status': 'imported'}
    },
    'self': 'http://localhost:8080/api/datasets/1/batches/',
    'description': 'A collection of batches for this Dataset. Each batch is a set of rows which were inserted together.',
    'entities': ['http://localhost:8080/api/datasets/1/batches/2/'],
    'element': 'shoji:catalog'
}

var fixtures = {
    datasetURL : datasetURL
    , datasetBatchesURL : datasetBatchesURL
    , datasetResponse: datasetResponse
    , batchesResponse: batchesResponse
};

module.exports = fixtures
