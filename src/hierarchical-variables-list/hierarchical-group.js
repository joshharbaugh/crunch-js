'use strict';

module.exports = HierarchicalGroupFactory

HierarchicalGroupFactory.$inject = [
    'machina'
    ,'HierarchicalVariable'
    ,'Traversable'
]

function HierarchicalGroupFactory(machina, HierarchicalVariable, Traversable) {

    var HierarchicalGroupBase = machina.Fsm.extend({

        initialState: 'uninitialized'
        ,namespace: 'hierarchicalGroupVariablesList'
        ,destroy: function(){
            return this.transition('destroyed')
        }
        ,_collapseItems: function() {
            this.items.forEach(function(item){
                item.handle('collapse')
            })
        }
        ,_store: function(cfg) {
            var group
                ;

            cfg = cfg || {}
            group = cfg.group

            this.parent = cfg.parent
            this.name = group.name
            this.self = group.self
            this.private = group.private
            this.level = group.level
            this.hierarchicalType = group.hierarchicalType
            this.group = group

            if(cfg.behaviors) {
                this.behaviors = cfg.behaviors
            }

            if(!group.items) {
                throw new Error('items are expected')
            }
        }
        , _createChildren : function() {
            var self = this
                , orderItems = this.group.items
                , behaviors = this.behaviors
                ;

            this.all = this.all || orderItems
            .filter(function(item) {
                return !item.discarded && !item.hidden
            })
            .filter(function(item) {
                return item.items ? item.items.length > 0 : true
            })
            .map(function(item) {
                var hierarchicalItem
                    ;

                if(item.hierarchicalType === 'variable') {
                    hierarchicalItem = HierarchicalVariable.create({
                        variable: item
                        , parent : self
                        , behaviors : behaviors
                    })
                } else {
                    hierarchicalItem = factory.create({
                        group : item
                        , parent : self
                        , behaviors: behaviors
                    })
                }

                return hierarchicalItem
            })

            this.items = this.all.filter(function(item) {
                return behaviors.isSatisfiedBy(item)
            })

            this.retraversable(this,'items')
        }
        , applyBehaviors: function(behaviors) {
            this.behaviors = behaviors

            this.items = (this.all || []).filter(function(item) {
                return behaviors.isSatisfiedBy(item)
            })
            .map(function(item) {
                item.applyBehaviors(behaviors)
                return item
            })

            return this
        }
        ,states: {
            destroyed: {
                _onEnter: function(){
                    this.items.forEach(function(varb){
                        varb.destroy()
                    }, this)
                    this.off()
                }
            }
        }
    })

    var HierarchicalGroup = HierarchicalGroupBase.extend({
        initialize: function(cfg) {
            this.items = []
            this._traversable = new Traversable({
                pageLength: this.threshold || 40
                ,pctOverlap: 0.5
            })

            this._traversable.augment(this, 'items')
        }
        ,states:{
            uninitialized: {
                initialize: function(cfg){
                    this._store(cfg)
                    return this.transition('collapsed')
                }
            }
            ,collapsed: {
                toggle: function(){
                    this.handle('expand')
                }
                ,expand: function(){
                    this.transition('expanded')

                    if(this.parent) {
                        this.parent.handle('expand')
                    }
                }
                ,'collapse-items' : function() {
                    this._collapseItems()
                }
            }
            ,expanded: {
                _onEnter : function() {
                    this._createChildren()
                }
                , toggle: function(){
                    this.handle('collapse')
                }
                ,collapse: function(){
                    this.transition('collapsed')
                }
                ,'collapse-items' : function() {
                    this._collapseItems()
                }
            }
        }
    })

    var factory = {
        create: function(cfg) {
            var group = new HierarchicalGroup(cfg)
            group.handle('initialize',cfg)
            return group
        }
    }

    return factory
}