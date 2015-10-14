'use strict'

module.exports = iGenerateMultitableFromCube

iGenerateMultitableFromCube.$inject = [
    'lodash'
    , '$q'
    , 'iResourceVariable'
    , 'analysisGenerator'
    , 'cube'
    , 'cubeMultitableQuery'
    , 'iFetchCubes'
]

function iGenerateMultitableFromCube(_
    , $q
    , iResourceVariable
    , analysisGenerator
    , Cube
    , cubeMultitableQuery
    , iFetchCubes) {

    function assertVariables(params) {
        if(!_.isObject(params) || !_.isArray(params.multitable_variables)) {
            throw new Error('provide an array of variables')
        }
    }

    function getXtabFromCube(params){
        function fetchVariableEntityIfNeeded(params){
            if (params.row_variable.valueOf().type === 'datetime'){
                return iResourceVariable({variableId: params.row_variable.valueOf().self})
                .then(function(varb){
                    params.row_variable = {valueOf: function() {return varb}}
                    return params
                })
            }
            return params
        }
        function buildQuery(params){
            return {
                datasetId: params.datasetId
                ,q: cubeMultitableQuery.build(
                params.multitable_variables.valueOf()
                , params.row_variable.valueOf()
                )
            }
        }
        function fetchFirstCube(params){
            return params.q.row.then(function(rq){
                return iFetchCubes({
                        query: rq
                        , datasetId: params.datasetId
                    })
                .then(function(result){
                    return {
                        row: result
                        , multi: params.q.multi
                        , datasetId: params.datasetId
                    }
                })
            })
        }
        function fetchMulti(params){
            return params.multi.then(function(q){
                if(q instanceof Array){
                    return $q.all([q.map(function(promise){
                            return promise.then(function(subq){
                                    return iFetchCubes({
                                    query: subq
                                    , datasetId: params.datasetId
                                })
                            })
                        })])
                        .then(function(multiResult){
                            multiResult.unshift(params.row)
                            return multiResult
                        })
                }
                return $q.all([
                    params.row
                    ,iFetchCubes({
                        query: q
                        , datasetId: params.datasetId
                    })
                ])
            })
        }
        function whaamCube(crunchCube){
            return Cube.fromMultiCube(crunchCube)
        }

        var handlers = [
            fetchVariableEntityIfNeeded
            , buildQuery
            , fetchFirstCube
            , fetchMulti
            , whaamCube
        ]
        var datasetId = params.datasetId
        return handlers.reduce($q.when, params)
    }

    var iGenerateMultitableFromCube = Object.create(analysisGenerator)

    iGenerateMultitableFromCube.accepts = function(params) {
        return params && params.multitable_variables && params.row_variable
    }

    iGenerateMultitableFromCube.execute = function(params) {
        params.multitable_variables = params.multitable_variables.valueOf()
        params.row_variable = params.row_variable.valueOf()
        assertVariables(params)
        return getXtabFromCube(params)
        .then(function(result){
            return {cube: result, columns: params.multitable_variables}
        })
    }

    return iGenerateMultitableFromCube
}
