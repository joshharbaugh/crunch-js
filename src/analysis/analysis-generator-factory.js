'use strict'

module.exports = AnalysisGeneratorFactory

AnalysisGeneratorFactory.$inject = [
    'lodash'
    , 'iGenerateAnalysisFromCube'
    , 'iGenerateAnalysisFromSaved'
]

function AnalysisGeneratorFactory(_
    , iGenerateAnalysisFromCube
    , iGenerateAnalysisFromSaved) {

    return {
        getGenerator : function(params) {
            var first = iGenerateAnalysisFromSaved
                ;

            iGenerateAnalysisFromSaved.next = iGenerateAnalysisFromCube

            return _.partial(first.generate.bind(first), params)
        }
    }
}
