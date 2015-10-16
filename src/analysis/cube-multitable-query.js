'use strict';

module.exports = CubeMultitableQuery

CubeMultitableQuery.$inject = [
    'lodash'
    ,'$q'
    ,'cubeQuery'
]
function CubeMultitableQuery(_, $q, cubeQuery){
    function build(multitableVariables, rowVariable, measures){
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
        // switch on variable type here: either an array of queries with
        // concise magic syntax for arrays and multiple response;
        // or a proper multi table query for other types.

        if (rowVariable.type === 'multiple_response' || rowVariable.type === 'categorical_array'){
            var r = _.cloneDeep(rowVariable)
            var rowPart = [_.extend(r, {'dimension': 'variable', type: rowVariable.type, self: rowVariable.self})]
            if (rowVariable.type === 'categorical_array'){
                var otherdim = _.cloneDeep(rowVariable)
                rowPart.unshift(_.extend(otherdim, {'dimension': 'each', type: rowVariable.type, self: rowVariable.self}))
            }
            var multi = multitableVariables.map(function(colVariable){
                var variables = _.cloneDeep(rowPart)
                variables.push(_.extend(colVariable, {'dimension': 'variable'}))
                return cubeQuery.build(variables)
            })
            return {
                row: cubeQuery.build(rowPart)
                ,multi: $q.when(multi)
            }
        }
        var colrefs = multitableVariables.map(function(varb){
            return {variable: varb.self}
        })
        var rowDim = types[rowVariable.type](rowVariable)
        var rowQuery = {
            dimensions: [rowDim],
            measures: measures
        }
        return {
            row: $q.when(rowQuery),
            multi: $q.when({
            'function': 'each',
            'args': [{
                'value': 'COLS'
            }, colrefs],
            'block': {
                'function': 'cube',
                'args': [
                    [
                        rowDim,
                        {'variable': 'COLS'}
                    ],
                    {
                        "map": measures
                    },
                    {
                        "value": null
                    }
                ]
            }
        })}
    }
    return {
        build: build
    }
}
