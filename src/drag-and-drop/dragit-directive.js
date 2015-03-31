'use strict';

module.exports = DragItDirective

DragItDirective.$inject = [
    'dragAndDrop'
    ,'$log'
]

/**
 * @class DragItDirective
 */
function DragItDirective(dragAndDrop, $log){
    return {
        restrict: 'ACE'
        ,link: function(scope, el, attrs) {
            var elm  = el[0]
            elm.setAttribute('draggable','true')

            var handle = dragAndDrop.handle.bind(dragAndDrop)
                ,classList= elm.classList
                ;
            function discoverOperation(){
                return (attrs.dragitOperation || 'drag')
            }
            function discoverClass(){
                return (attrs.dragitClass || 'dragging')
            }
            function getData(){
                return scope.$eval(attrs.dragit)
            }
            function onDragStart(e){
                $log.debug('drag-and-drop','drag','start',e)
                scope.$apply(function(){
                    classList.add(discoverClass())

                    e.dataTransfer.effectAllowed = (attrs.dragitOperation || 'all')
                    var inflight = {
                        data: getData()
                        ,element: elm
                        ,event: e
                    }
                    var operation = discoverOperation()
                    handle(operation,inflight)
                })
            }
            function onDragEnd(e) {
                $log.debug('drag-and-drop','drag','end',e)
                scope.$apply(function(){
                    var klass = discoverClass()
                    classList.remove(klass)
                    dragAndDrop.handle('cancel')
                })
            }
            elm.addEventListener('dragstart',onDragStart)
            elm.addEventListener('dragend',onDragEnd)
            scope.$on('$destroy',function(){
                elm.removeEventListener('dragstart',onDragStart)
                elm.removeEventListener('dragend',onDragEnd)
            })
        }
    }

}
