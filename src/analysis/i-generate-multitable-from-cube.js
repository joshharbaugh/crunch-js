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

    function getXtabFromCube(params){
        function fetchVariableEntityIfNeeded(params){
            if (params.rowVariable.type === 'datetime'){
                return iResourceVariable({variableId: params.rowVariable.self})
                .then(function(varb){
                    params.rowVariable = varb
                    return params
                })
            }
            return params
        }
        function buildQuery(params){
            return {
                datasetId: params.datasetId
                ,q: cubeMultitableQuery.build(
                    params.columnQueries
                    , params.rowVariable
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
                    return $q.all(q).then(function(subqs){
                        return subqs.map(function(subq){
                                return iFetchCubes({
                                query: subq
                                , datasetId: params.datasetId
                            })
                        })
                    })
                    .then(function(multiResult){
                        return $q.all(multiResult)
                        .then(function(done){
                            return [params.row, done]
                        })
                    }) // [ {}, [{} , {}]  ]
                }
                return $q.all([
                    params.row
                    ,iFetchCubes({
                        query: q
                        , datasetId: params.datasetId
                    })
                ]) //[ {}, [ {}, {} ]]
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
        return getXtabFromCube(params)
        .then(function(result){
            return {cube: result, columns: params.columnQueries}
        })
    }

    return iGenerateMultitableFromCube
}
