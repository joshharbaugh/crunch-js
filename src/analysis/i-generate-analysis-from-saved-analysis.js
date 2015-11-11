'use strict'

module.exports = IGenerateAnalysisFromSavedFactory

IGenerateAnalysisFromSavedFactory.$inject = [
    'lodash'
    , 'analysisGenerator'
    , 'iResourceDataset'
    , 'crFindVariables'
    , 'cube'
    , 'iFetchCubes'
]

function IGenerateAnalysisFromSavedFactory(_
    , analysisGenerator
    , iResourceDataset
    , findVariables
    , Cube
    , iFetchCubes) {

    var acc
        ;

    function assertDataset(params) {
        if(!_.isObject(params) ||  !_.isString(params.datasetId)) {
            throw new Error('provide a dataset id')
        }
    }

    function fetchQuery(acc, dataset) {
        acc.dataset = dataset
        return iFetchCubes({
            datasetId: dataset.self
            ,query: acc.analysis.query
        })
    }
    function makeWhaamCube(acc, crunchCube){
        return Cube.fromCrCube(crunchCube)
    }
    function prepareResult(acc, whaamCube) {
        /* (1) turn the fetched result into a whaam cube
           (2) get variable ids from its dimensions and measures
        */
        var cube = whaamCube
        var dims = acc.analysis.query.dimensions.filter(function(d){
            return d.function ? d.function !== 'selected_array' : true
        })
        var variables = dims.map(function(d){
            return {
                self: findVariables(d)
                ,dimension: d.each ?
                    "each" : "variable"
            }
        })
        // somewhat brittle: the variable of which the mean is taken
        // is in this array 'args'.
        var measures = acc.analysis.query.measures.mean ?
            findVariables(acc.analysis.query.measures.mean) : undefined
        return {
            cube: cube
            ,variables: variables
            ,measureVariables: measures
            ,analysis: acc.analysis
        }
    }

    var iGenerateAnalysisFromSaved = Object.create(analysisGenerator)

    iGenerateAnalysisFromSaved.accepts = function(params) {
        return _.isObject(params) && _.isObject(params.analysis) && params.slideId
    }

    iGenerateAnalysisFromSaved.execute = function(params) {
        assertDataset(params)
        acc = {}
        acc.analysis = params.analysis
        return iResourceDataset({ datasetId : params.datasetId }).then(function(ds){
            var handlers = [
                fetchQuery
                , makeWhaamCube
                , prepareResult
            ]
            return ds.reduce(acc, handlers)
        })
    }

    return iGenerateAnalysisFromSaved
}
