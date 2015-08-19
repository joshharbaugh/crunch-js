'use strict';

module.exports = DragItDirective

DragItDirective.$inject = [
    'dragAndDrop'
    ,'$log'
    , '$timeout'
]

/**
 * @class DragItDirective
 */
function DragItDirective(dragAndDrop, $log, $timeout){
    return {
        restrict: 'ACE'
        ,link: function(scope, el, attrs) {
            var elm  = el[0]

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
            function onDragStart(e) {
                var data = getData()
                    ;

                $log.debug('drag-and-drop','drag','start',e)
                classList.add(discoverClass())
                e.dataTransfer.effectAllowed = (attrs.dragitOperation || 'all')

                try {
                    e.dataTransfer.setData('application/json', data)
                } catch(error) {
                    //IE does not support complex data payload
                    e.dataTransfer.setData('text', JSON.stringify(data))
                }

                scope.$apply(function(){
                    var inflight = {
                        data: data
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

            /*
                Delay events attachment. Attaching them in the linking
                process makes firefox fail. I guess this could add some
                performance gains too b/c DOM mutation happens after the
                rendering process so yay.
             */
            $timeout(function() {
                elm.setAttribute('draggable', 'true')
                elm.addEventListener('dragstart', onDragStart)
                elm.addEventListener('dragend', onDragEnd)
            }, 500)

            scope.$on('$destroy',function(){
                elm.removeEventListener('dragstart',onDragStart)
                elm.removeEventListener('dragend',onDragEnd)
            })
        }
    }

}
