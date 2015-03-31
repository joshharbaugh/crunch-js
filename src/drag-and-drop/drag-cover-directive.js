;
module.exports = (function() {
    'use strict';

    function DragCoverDirective($injector) {
        return {
            restrict: 'A'
            , link: function(scope, elem, attrs) {
                var handleExpand = function(e) {
                    elem.addClass('drag-cover')
                };
                var handleContract = function(e) {
                    elem.removeClass('drag-cover')
                };
                scope.handleExpand = handleExpand;
                scope.handleContract = handleContract;
                elem.bind('drop', function(e) {
                    if (e.preventDefault) {
                        e.preventDefault()
                    }
                    scope.$safeApply(function() {
                        handleContract.apply(this, [e.originalEvent])
                    })
                });
                if (attrs.dragCoverExpandEvent) {
                    scope.$on(attrs.dragCoverExpandEvent, function(evt, data) {
                            handleExpand.apply(this, evt)
                        })
                }
                if (attrs.dragCoverContractEvent) {
                    scope.$on(attrs.dragCoverContractEvent, function(evt, data) {
                            handleContract.apply(this, evt)
                        })
                }
                scope.$on('$destroy', function() {
                    elem.off('drop')
                })
            }
        }
    }
    DragCoverDirective.$inject = ['$injector'];
    return DragCoverDirective
})
    .call(this);
