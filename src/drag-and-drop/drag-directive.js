'use strict';
module.exports = DragDirective

DragDirective.$inject = [
    '$injector'
    ,'$rootScope'
];

function DragDirective($injector, $rootScope) {
    var SERIALIZER_KEY = '__serializer';
    return {
        restrict: 'A'
        , link: function(scope, elem, attrs) {
            var draggedData
                ,elm = elem[0];
            elm.setAttribute('draggable', true);
            scope.$watch(attrs.drag, function(value) {
                if (!value) {
                    return
                }
                draggedData = value
            });

            function serialize(it) {
                var serializerName = it[SERIALIZER_KEY];
                if (it && serializerName) {
                    var serializer = $injector.get(
                        serializerName);
                    if (!serializer) {
                        throw new Error('serializer ' +
                            serializerName +
                            ' could not be found.')
                    }
                    if (!serializer.serialize) {
                        throw new Error('serializers ' +
                            serializerName +
                            ' forgot to implement `serialize`'
                        )
                    }
                    return serializer.serialize(it)
                }
                return JSON.stringify(it)
            }
            var handleDragStart = function(e) {
                scope.$apply(function(){
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('application/json', serialize(draggedData));
                    e.dataTransfer.setData('text/plain', attrs.dragKey);
                    elm.classList.add('dragging')
                    if (attrs.dragEvent) {
                        var data = {
                            draggedData: draggedData
                            , key: attrs.dragKey
                        };
                        scope.$emit(attrs.dragEvent, data)
                        //$rootScope.$broadcast(attrs.dragEvent, data)
                    }
                })
            };
            var handleDragEnd = function(e) {
                scope.$apply(function(){
                    elm.classList.remove('dragging')
                    if (attrs.dragEndEvent) {
                        scope.$emit(attrs.dragEndEvent, {})
                        //$rootScope.$broadcast(attrs.dragEndEvent, {})
                    }
                })
            };
            scope.handleDragStart = handleDragStart;
            scope.handleDragEnd = handleDragEnd;

            elm.addEventListener('dragstart', handleDragStart.bind(this))
            elm.addEventListener('dragend', handleDragEnd.bind(this))

            scope.$on('$destroy', function() {
                draggedData = undefined
                elm.removeEventListener('dragstart',handleDragStart);
                elm.removeEventListener('dragend',handleDragEnd);
            })
        }
    }
}
