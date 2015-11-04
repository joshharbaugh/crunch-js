'use strict'

module.exports = AnalysisGeneratorFactory

AnalysisGeneratorFactory.$inject = [
    'lodash'
    , 'iGenerateAnalysisFromCube'
    , 'iGenerateAnalysisFromSaved'
    , 'iGenerateAnalysisFromPublicResource'
]

function AnalysisGeneratorFactory(_
    , iGenerateAnalysisFromCube
    , iGenerateAnalysisFromSaved
    , iGenerateAnalysisFromPublicResource) {

    return {
        getGenerator : function(params) {
            var first = iGenerateAnalysisFromSaved
                ;

            iGenerateAnalysisFromSaved.next = iGenerateAnalysisFromCube
            iGenerateAnalysisFromCube.next = iGenerateAnalysisFromPublicResource

            return _.partial(first.generate.bind(first), params)
        }
    }
}
