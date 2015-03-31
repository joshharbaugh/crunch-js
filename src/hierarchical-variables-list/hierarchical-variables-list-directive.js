'use strict';

module.exports = HierarchicalVariablesListDirective

HierarchicalVariablesListDirective.$inject = [
]

function HierarchicalVariablesListDirective() {

    return {
        restrict: 'E'
        ,templateUrl: '/hierarchical-variables-list/hierarchical-variables-list.html'
        ,link: function( scope ) {
            var currentHVL
                ;

            scope.$watch('hierarchicalVariablesList', function(hvl) {
                refreshRoot(hvl)

                if(currentHVL !== hvl) {
                    currentHVL = hvl
                    hvl.on('hvl.refreshed', function() {
                        refreshRoot(hvl)
                    })
                }
            })

            function refreshRoot(hvl) {
                scope.root = hvl.root
            }
        }
    }
}
