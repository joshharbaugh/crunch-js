'use strict'

module.exports = IGenerateAnalysisFromPublicAnalysis

IGenerateAnalysisFromPublicAnalysis.$inject = [
    'lodash'
    , 'Shoji'
    , 'crFindVariables'
    , 'cube'
    , 'analysisGenerator'
]

function IGenerateAnalysisFromPublicAnalysis(_, Shoji, crFindVariables, cube, analysisGenerator) {
    var generator = Object.create(analysisGenerator)

    function createAnalysis(publicAnalysisData) {
        var references = createReferenceResources(publicAnalysisData.definitions)
            , variableIds = getQueryVariables(publicAnalysisData.queries[0])
            , variables = mapQueryVariablesToShojiResource(variableIds, references)
            , measures = mapQueryMeasuresToShojiResources(publicAnalysisData.queries[0], references)
            , filters = mapFiltersToShojiResources(publicAnalysisData.query_environment.filters, references)
            ;

        return createCubeFromResult(publicAnalysisData.results[0]).then(function(cube) {
            return {
                variables : variables
                , measureVariables : measures
                , cube : cube
                , filters : filters
                , analysis : {
                    display_settings : publicAnalysisData.display_settings
                }
            }
        })
    }

    function createCubeFromResult(result) {
        return cube.fromCrCube(result.value)
    }

    function mapFiltersToShojiResources(filters, references) {
        return mapToShojiResources(filters, references)
    }

    function mapQueryVariablesToShojiResource(queryVariables, references) {
        return queryVariables.map(function(queryVariable) {
            var variableResource = mapToShojiResource(queryVariable.variableId, references)
                ;

            variableResource.dimension = queryVariable.dimension
            return variableResource
        })
    }

    function getQueryVariables(query) {
        return query.dimensions.map(function(variableExpression) {
            return {
                variableId : crFindVariables(variableExpression)
                , dimension : variableExpression.function === 'each' ? 'each' : 'variable'
            }
        })
    }

    function mapQueryMeasuresToShojiResources(query, referencesMap) {
        return Object.keys(query.measures).map(function(type) {
            return {
                type : type
                , variable : mapToShojiResource(query.measures[type], referencesMap)
            }
        })
    }

    function createReferenceResources(referencesMap) {
        return Object.keys(referencesMap).map(function(referenceURL) {
            return Shoji(referenceURL).parse(referencesMap[referenceURL])
        })
    }

    function mapToShojiResources(ids, references) {
        return ids.map(function(id) {
            return mapToShojiResource(id, references)
        })
    }

    function mapToShojiResource(id, references) {
        return references.filter(function(ref) {
            return ref.self === id
        })[0]
    }

    generator.execute = function(params) {
        return Shoji(params.publicAnalysisURL).map({ withCredentials : false }).then(function(publicAnalysis) {
            return createAnalysis(publicAnalysis.value)
        })
    }

    generator.accepts = function(params) {
        return params &&
               _.isString(params.publicAnalysisURL) &&
               params.publicAnalysisURL.length > 0
    }

    return generator
}