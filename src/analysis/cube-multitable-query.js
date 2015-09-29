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
            var res = varb.view.rollup_resolution || NULL;
            var sanitizedRollup = res === "" ? NULL : res

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
            return multitableVariables.map(function(colVariable){
                var variables = [
                    _.extend(rowVariable, {'dimension': 'variable'})
                    ,_.extend(colVariable, {'dimension': 'variable'})
                ]
                if (rowVariable.type === 'categorical_array'){
                    variables.shift(_.extend(rowVariable, {'dimension': 'variable'}))
                }
                return cubeQuery.build(variables = variables)
            })
        }
        return $q.when({
            'function': 'each',
            'args': [{
                'value': 'COLS'
            }, multitableVariables],
            'block': {
                'function': 'cube',
                'args': [
                    [
                        types[rowVariable.type](rowVariable),
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
        })
    }
    return {
        build: build
    }
}
