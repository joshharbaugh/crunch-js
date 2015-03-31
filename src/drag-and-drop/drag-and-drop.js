'use strict';

module.exports = DragAndDropFactory

DragAndDropFactory.$inject = [
    'machina'
    ,'$rootScope'
    ,'$log'
]

function DragAndDropFactory(machina, $rootScope, $log) {


    function assert(pred, msg){
        if(pred){
            return
        }
        throw new Error(msg)
    }
    function debug(e){
        return function() {
            var args = [].slice.call(arguments)
            args.unshift(e)
            args.unshift('drag-and-drop')
            return $log.debug.apply($log,args)
        }
    }
    var DragAndDrop = machina.Fsm.extend({
        initialState: 'uninitialized'
        ,destroy: function(){
            this.transition('destroyed')
        }
        ,_publish: function(event, operation,dropped) {
            var e = event
            if(operation) {
                e += (':' + operation)
            }

            var payload = {
                operation: operation
                ,dragged: this.inflight
                ,dropped: dropped
            }
            $log.debug('drag-and-drop','publishing',e,payload)
            $rootScope.$broadcast(e,payload)
        }
        ,_broadcast: function(e){
            assert(e.event,'event name is required')
            return $rootScope.$broadcast(e.event,e)
        }
        ,initialize: function(){
            this.on('transition',debug('transition'))
            this.on('link:started',this._broadcast.bind(this))
            this.on('move:started',this._broadcast.bind(this))
            this.on('copy:started',this._broadcast.bind(this))
            this.on('drag:started',this._broadcast.bind(this))
            this.on('link:cancelled',this._broadcast.bind(this))
            this.on('move:cancelled',this._broadcast.bind(this))
            this.on('copy:cancelled',this._broadcast.bind(this))
            this.on('drag:cancelled',this._broadcast.bind(this))
        }
        ,states: {
            uninitialized: {
                initialize: function(){
                    this.transition('draggable')
                }
            }
            ,draggable: {
                _onEnter: function(){
                    this.inflight = undefined
                }
                ,drag: function(spec) {
                    this.inflight = spec
                    this.transition('dragging')
                }
                ,link: function(spec) {
                    this.inflight = spec
                    this.transition('linking')
                }
                ,copy: function(spec) {
                    this.inflight = spec
                    this.transition('copying')
                }
                ,move: function(spec) {
                    this.inflight = spec
                    this.transition('moving')
                }
            }
            //generic, 'all' handlers
            ,dragging: {
                _onEnter: function(){
                    this.emit('drag:started',{
                        event: 'drag:started'
                        ,inflight: this.inflight
                        ,operation: 'drag'
                    })
                }
                ,commit: function(e, droppedOn) {
                    this._publish(e,undefined,droppedOn)
                    this.transition('draggable')
                }
                ,cancel: function(){
                    this.emit('drag:cancelled',{
                        event: 'drag:cancelled'
                        ,inflight: this.inflight
                        ,operation: 'drag'
                    })
                    this.transition('draggable')
                }
            }
            //link handlers
            ,linking: {
                _onEnter: function(){
                    this.emit('link:started',{
                        event: 'link:started'
                        ,inflight: this.inflight
                        ,operation: 'link'
                    })
                }
                ,commit: function(e, droppedOn){
                    if(typeof e === 'string'){
                        this._publish(e,'link',droppedOn)
                    } else {
                        this._publish('drop','link',droppedOn)
                    }
                    this.transition('draggable')
                }
                ,cancel: function(){
                    this.emit('link:cancelled',{
                        event: 'link:cancelled'
                        ,inflight: this.inflight
                        ,operation: 'link'
                    })
                    this.transition('draggable')
                }
            }
            ,copying: {
                _onEnter: function(){
                    this.emit('copy:started',{
                        event: 'copy:started'
                        ,inflight: this.inflight
                        ,operation: 'copy'
                    })
                }
                ,commit: function(e,droppedOn){
                    this._publish(e,'copy',droppedOn)
                    this.transition('draggable')
                }
                ,cancel: function(){
                    this.emit('copy:cancelled',{
                        event: 'copy:cancelled'
                        ,inflight: this.inflight
                        ,operation: 'copy'
                    })
                    this.transition('draggable')


                }
            }
            ,moving: {
                _onEnter: function(){
                    this.emit('move:started',{
                        event: 'move:started'
                        ,inflight: this.inflight
                        ,operation: 'move'
                    })
                }
                ,commit: function(e, droppedOn){
                    this._publish(e,'move',droppedOn)
                    this.transition('draggable')
                }
                ,cancel: function(){
                    this.emit('move:cancelled',{
                        event: 'move:cancelled'
                        ,inflight: this.inflight
                        ,operation: 'move'
                    })
                    this.transition('draggable')
                }
            }
            ,destroyed: {
                _onEnter: function(){
                    return this.off()
                }
            }
        }

    })

    var one = new DragAndDrop()
    one.handle('initialize')

    return one
}
