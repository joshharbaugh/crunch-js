'use strict'

var batchURL = 'http://localhost:8080/api/datasets/1/batches/3/'
var batchesURL = 'http://localhost:8080/api/datasets/1/batches/'

var batchResponse = {
    'body': {
        'conflicts': {'c': [
            {
                'message': 'Only in existing dataset',
                'resolution': 'Additional rows will be marked missing.',
                'resolved_by': '2'
            },
            {
                'message': 'Categories do not match',
                'resolution': 'Union of categories will be used.',
                'resolved_by': '4'
            }
        ]},
        'source': '2',
        'workflow': [{'long thing': { blah: "blah"}}],
        'revisions': ['1', '2', '3', '4']
    },
    'description': 'A batch for this Dataset. Each batch is a set of rows which were inserted together.',
    'self': 'http://localhost:8080/api/datasets/1/batches/3/',
    'element': 'shoji:entity',
    'urls': {'table_url': 'http://localhost:8080/api/datasets/1/batches/3/table/'},
    'fragments': {'table': 'http://localhost:8080/api/datasets/1/batches/3/table/'}
}

var batchesResponse = {
    'index': {
        'http://localhost:8080/api/datasets/1/batches/2/': {
            'status': 'imported'}
    },
    'self': 'http://localhost:8080/api/datasets/1/batches/',
    'description': 'A collection of batches for this Dataset. Each batch is a set of rows which were inserted together.',
    'entities': ['http://localhost:8080/api/datasets/1/batches/3/'],
    'element': 'shoji:catalog'
}

module.exports = {
    batchesURL : batchesURL
    ,batchesResponse : batchesResponse
    ,batchURL : batchURL
    ,batchResponse : batchResponse
}
