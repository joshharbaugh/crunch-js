'use strict';

module.exports = CubeMultitableQuery

CubeMultitableQuery.$inject = [
    'lodash'
    ,'$q'
    ,'cubeQuery'
]
function CubeMultitableQuery(_, $q, cubeQuery){
    function build(columnQueries, rowVariable, measures){
        var types = {}
        measures = measures || {"count": {"function": "cube_count", "args": []}}

        types.categorical = function(varb){
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/') {
                variableId = variableId.substring(0, variableId.length - 1)
            }
            return {variable: variableId}
        }
        types.numeric = function(varb){
            //TODO allow a unique-values query instead,
            //inspecting some config on the varb
            //TODO bin 'breaks' arg??
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }

            return {'function': 'bin', 'args': [{'variable': variableId}]}
        }
        types.text = function(varb){
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }
            return {variable: variableId}
        }
        types.datetime = function(varb){
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }
            var res = varb.view.rollup_resolution || null;
            var sanitizedRollup = res === "" ? null : res

            return {'function': 'rollup',
                'args': [
                    {'variable': variableId}
                    ,{'value': sanitizedRollup}
                ]}
        }
        types.multiple_response = function(varb){

           return [
                {'function': 'selected_array',
                    'args': [ {'variable': varb.self } ] }
                , { 'each': varb.self }
            ]
        }
        types.categorical_array = function(varb){
           return [
                { 'each': varb.self }
                ,{'variable': varb.self}
            ]
        }
        var rowDim = types[rowVariable.type](rowVariable)
        var rowQuery = {
            dimensions: _.flatten([rowDim]),
            measures: measures
        }
        var multi = columnQueries.map(function(col){
            var q = _.cloneDeep(rowQuery)
            q.dimensions.push(col.query)
            q.dimensions = _.flatten(q.dimensions)
            return q
        })

        // The composed syntax seemingly does not respect filters.
        // Until this can be confirmed and fixed on backend,
        // all queries to use multiple queries: sad face.
        // var composed_multi = {
        //     'function': 'each',
        //     'args': [{
        //         'value': 'COLS'
        //     }, colrefs],
        //     'block': {
        //         'function': 'cube',
        //         'args': [
        //             [
        //                 rowDim,
        //                 {'variable': 'COLS'}
        //             ],
        //             {
        //                 "map": measures
        //             },
        //             {
        //                 "value": null
        //             }
        //         ]
        //     }
        // }
        return {
            row: $q.when(rowQuery),
            multi: $q.when(multi)
        }
    }
    return {
        build: build
    }
}
