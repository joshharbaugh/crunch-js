'use strict';

module.exports = DropItDirective

DropItDirective.$inject =[
    'dragAndDrop'
    ,'$log'
]

function DropItDirective(dragAndDrop, $log){
    return {
        restrict: 'ACE'
        ,scope:true
        ,link: function(scope, el, attrs) {
            var elm = el[0]
                ,classList = elm.classList
                , applied = false
                , enterTime = 0
                , enterTarget
                ;

            elm.setAttribute('droppable','true')
            elm.classList.add('drop-zone')

            function discoverDroppableClass(){
                return (attrs.dropitClass || 'drag-over')
            }

            function applyClass(e) {
                if(!applied) {
                    classList.add(discoverDroppableClass())
                    applied = true
                }
            }

             function removeClass(e) {
                if(applied) {
                    classList.remove(discoverDroppableClass())
                    applied = false
                }
            }

            function onDrop(e){
                $log.debug('drag-and-drop','drop','dropped',e)
                if(e.preventDefault){
                    e.preventDefault()
                }
                if(e.stopPropagation){
                    e.stopPropagation()
                }
                scope.$apply(function(){
                    var e = (attrs.dropitEvent || 'dropped')
                    dragAndDrop.handle('commit',e,scope.$eval(attrs.dropit))
                })

                scope.$broadcast('drop')
                removeClass(e)
            }
            function onDragOver(e) {
                //here is where we need to see if the
                //dragging element is somehow associated with the collection
                //this item is a part of. if so, is it 'sortable' and so should
                //be ignored?
                if(e.preventDefault){
                    e.preventDefault()
                }
                if(e.stopPropagation){
                    e.stopPropagation()
                }
                //special sauce
                e.dataTransfer.dropEffect = 'all'
                //yup, this fires way too much
                applyClass(e)
                scope.$broadcast('dragover')
            }

            function onDragEnter(e) {
                enterTarget = e.currentTarget
                $log.debug('drag-and-drop','drop','dragenter',e)
                if(e.preventDefault){
                    e.preventDefault()
                }
                if(e.stopPropagation){
                    e.stopPropagation()
                }

                enterTime = performance.now()

                //yup..this is interrupted by a bug
                //applyClass(e)
            }
            function onDragLeave(e){
                var enterLeaveInterval = performance.now() - enterTime
                if(e.preventDefault){
                    e.preventDefault()
                }

                if(e.stopPropagation){
                    e.stopPropagation()
                }

                /*
                This event is triggered many times, even with the slighest change
                in the draggable's position. Since enter and leave events happen
                within really small intervals, the drag enter style flickers and
                the UI enters in an inconsistent state. This condition verifies
                that the class is only remove is
                 */
                if(enterLeaveInterval > 1) {
                    removeClass(e)
                    scope.$broadcast('dragleave')
                }
            }


            elm.addEventListener('drop',onDrop)
            elm.addEventListener('dragover',onDragOver)
            elm.addEventListener('dragenter',onDragEnter)
            elm.addEventListener('dragleave',onDragLeave)
            scope.$on('$destroy',function(){
                elm.removeEventListener('drop',onDrop)
                elm.removeEventListener('dragover',onDragOver)
                elm.removeEventListener('dragenter',onDragEnter)
                elm.removeEventListener('dragleave',onDragLeave)
            })
        }
    }
}
