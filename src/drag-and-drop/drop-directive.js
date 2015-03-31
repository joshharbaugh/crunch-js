'use strict';
module.exports = DropDirective

DropDirective.$inject = ['$log', '$injector'];
function DropDirective($log, $injector) {
    var SERIALIZER_KEY = '__serializer';
    return {
        restrict: 'A'
        , link: function(scope, elem, attrs) {
            var droppableData;
            var elm = elem[0]
                ,classList = elm.classList
                ;

            elm.setAttribute('droppable',true)
            classList.add('drop-zone')

            scope.$watch(attrs.drop, function(value) {
                if (!value) {
                    return
                }
                droppableData = value
            });
            var handleDragEnter = function(e) {
                scope.$apply(function(){
                    if (e.stopPropagation()) {
                        e.preventDefault()
                    }
                    classList.add('drag-over')

                })
            };
            var handleDragOver = function(e) {
                if (e.preventDefault) {
                    e.preventDefault()
                }
            };
            var handleDragLeave = function(e) {
                scope.$apply(function(){
                    if (e.stopPropagation()) {
                        e.preventDefault()
                    }
                    classList.remove('drag-over')

                })
            };

            function deserialize(str) {
                var json = JSON.parse(str);
                if (str.search(SERIALIZER_KEY) < 0) {
                    return json
                }
                var serializerName = json[SERIALIZER_KEY];
                var serializer = $injector.get(serializerName);
                if (!serializer) {
                    throw new Error('serializer ' +
                        serializerName + ' not found')
                }
                if (!serializer.deserialize) {
                    throw new Error('serializer ' +
                        serializerName +
                        ' forgot to implement deserialize')
                }
                return serializer.deserialize(str)
            }
            var handleDrop = function(e) {
                scope.$apply(function(){
                    if (e.preventDefault) {
                        e.preventDefault()
                    }
                    classList.remove('drag-over')
                    if (attrs.dropKey === e.dataTransfer.getData(
                        'text/plain')) {
                        var key = e.dataTransfer.getData(
                            'text/plain');
                        var droppedData = e.dataTransfer.getData(
                            'application/json');
                        var droppedObject = deserialize(
                            droppedData);
                        if (attrs.dropEvent) {
                            var data = {
                                droppedData: droppedObject
                                , targetData: droppableData
                                , key: attrs.dropKey
                            };
                            scope.$emit(attrs.dropEvent, data)
                        }
                        return true
                    } else {
                        scope.$emit(attrs.dropCancel, {});
                        return false
                    }

                })
            };
            scope.handleDragEnter = handleDragEnter;
            scope.handleDragLeave = handleDragLeave;
            scope.handleDragOver = handleDragOver;
            scope.handleDrop = handleDrop;
            elm.addEventListener('dragenter', handleDragEnter.bind(this))
            elm.addEventListener('dragleave', handleDragLeave.bind(this))
            elm.addEventListener('dragover', handleDragOver.bind(this))
            elm.addEventListener('drop', handleDrop.bind(this))
            scope.$on('$destroy', function() {
                elm.removeEventListener('drop', handleDrop);
                elm.removeEventListener('dragleave',handleDragLeave)
                elm.removeEventListener('dragover',handleDragOver)
                elm.removeEventListener('dragenter',handleDragEnter)
            })
        }
    }
}
