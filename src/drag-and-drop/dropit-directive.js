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
                $log.debug('drag-and-drop','drop','dragenter',e)
                if(e.preventDefault){
                    e.preventDefault()
                }
                if(e.stopPropagation){
                    e.stopPropagation()
                }

                //yup..this is interrupted by a bug
                //applyClass(e)
            }
            function onDragLeave(e){
                $log.debug('drag-and-drop','drop','dragleave',e)
                if(e.preventDefault){
                    e.preventDefault()
                }
                if(e.stopPropagation){
                    e.stopPropagation()
                }
                removeClass(e)

                scope.$broadcast('dragleave')
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
