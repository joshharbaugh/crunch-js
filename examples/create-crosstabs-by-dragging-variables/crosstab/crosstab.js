app.factory('createAnalysis', function(currentDataset, Analysis) {
    'use strict'
    return function() {
        return currentDataset.fetch().then(function(ds) {
            return Analysis.create({
                datasetId : ds.self
            })
        })
    }
})

// Although fine for an example, this array injection annotation
// is hard to read and an explicit $inject array is preferable
app.factory('createXtab', ['lodash', 'stats', 'ndarrayOps', 'ndarrayUnpack', function(_, stats, ndarrayOps, ndarrayUnpack) {
    'use strict'

    return function(cube) {
        // Here do any stat manipulation of the cube:
        // for example, column-wise proportions. Stats likewise
        // returns an ndarray, which we MULtiply by Scalar 100
        var columnPercentages = stats.propTable(cube, 1)

        ndarrayOps.mulseq(columnPercentages, 100)
        return {
            xtab: {
                rowLabels:    cube.labels[0],
                columnLabels: cube.labels[1] ? cube.labels[1] : ["Percent"],
                rows:         _.flatten(ndarrayUnpack(columnPercentages)) // row-major array-of-arrays
            },
            // To get the (weighted) total of a cube, call stats.margin without
            // its second argument 'axis'. Margin takes into account any special
            // properties of dimensions such as those that belong to a
            // multiple-response variable or a categorical array.
            // The result is always an ndarray whose get method returns a Number
            total : stats.margin(cube).get(0,0)
        }
    }
}])


function CrTableDirective(createAnalysis, createXtab) {
    'use strict'

    return {
        restrict: 'E',
        templateUrl : '/crosstab/crosstab.html',
        link: function($scope) {

            $scope.$on('variable.clicked', function(e, data) {
                if (data.variable.type === 'categorical_array') { return }
                createAnalysis().then(function(analysis) {
                    analysis.handle('add-variable', data.variable.self)
                    analysis.on('analysis.loaded', function() {
                        var results = createXtab(analysis.data.cube)
                            ;
                        $scope.xtab = results.xtab;
                    })
                })

            })
        }
    }
}

app.directive('crTable', CrTableDirective)
