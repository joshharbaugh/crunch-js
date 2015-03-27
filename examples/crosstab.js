
var app = angular.module('crosstabDemo', [
    'cube',
    'stats',
    'ndarrayOps',
    'unpack'
])

app.service('exampleCube', function(){
    return function(){
        // load this from json? Content is the 'value' member of a shoji:view
        cube.fromCrCube({"query": {"measures": {"count": {"function": "cube_count", "args": []}}, "weight": null, "dimensions": [{"variable": "***REMOVED***/api/datasets/b68bd9367f684b109e908565e2511bd4/variables/4cc1a74b85254639b6fdf45223d8fbd4"}, {"variable": "***REMOVED***/api/datasets/b68bd9367f684b109e908565e2511bd4/variables/6604f51586f14710abab0d673063355b"}], "filters": []}, "result": {"dimensions": [{"references": {"discarded": false, "alias": "Admit", "name": "Admit", "header_order": 0}, "derived": false, "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": null, "missing": false, "id": 1, "name": "Admitted"}, {"numeric_value": null, "missing": false, "id": 2, "name": "Rejected"}]}}, {"references": {"discarded": false, "alias": "Dept", "name": "Dept", "header_order": 2}, "derived": false, "type": {"ordinal": false, "class": "categorical", "categories": [{"numeric_value": null, "missing": false, "id": 1, "name": "A"}, {"numeric_value": null, "missing": false, "id": 2, "name": "B"}, {"numeric_value": null, "missing": false, "id": 3, "name": "C"}, {"numeric_value": null, "missing": false, "id": 4, "name": "D"}, {"numeric_value": null, "missing": false, "id": 5, "name": "E"}, {"numeric_value": null, "missing": false, "id": 6, "name": "F"}]}}], "missing": 0, "measures": {"count": {"data": [601, 370, 322, 269, 147, 46, 332, 215, 596, 523, 437, 668], "n_missing": 0, "metadata": {"references": {}, "derived": true, "type": {"integer": true, "class": "numeric", "missing_reasons": {"No Data": -1}, "missing_rules": {}}}}}, "element": "crunch:cube", "margins": {"0": {"data": [1755, 2771]}, "1": {"data": [933, 585, 918, 792, 584, 714]}, "data": [4526]}, "n": 4526}})
        .then(function(crunchJsCube){
            return crunchJsCube
        })

    }
})

// Although fine for an example, this array injection annotation
// is hard to read and an explicit $inject array is preferable
app.directive('crTable', ['cube', 'stats', 'ndarrayOps', 'unpack', function(cube, stats, ops, unpack){
    return {
        restrict: 'A',
        scope: {
            cube: '='
        },
        link: function($scope, $element, $attrs){
            var cube = $scope.cube

            // Here do any stat manipulation of the cube:
            // for example, column-wise proportions. Stats likewise
            // returns an ndarray, which we MULtiply by Scalar 100
            var columnPercentages = ops.muls(stats.propTable(cube, 1), 100)

            $scope.xtab = {
                rowLabels: cube.labels[0],
                columnLabels: cube.labels[1],
                rows: unpack(columnPercentages) // row-major array-of-arrays
            }

            // To get the (weighted) total of a cube, call stats.margin without
            // its second argument 'axis'. Margin takes into account any special
            // properties of dimensions such as those that belong to a
            // multiple-response variable or a categorical array.
            // The result is always an ndarray whose get method returns a Number
            $scope.total = stats.margin(cube).get(0,0)
        }
    }
}])
