'use strict';

module.exports = HierarchicalVariablesListFactory

HierarchicalVariablesListFactory.$inject = [
    'assert'
    ,'machina'
    ,'HierarchicalGroup'
    ,'hierarchicalBehaviors'
    ,'HierarchicalVariables'
]
function HierarchicalVariablesListFactory(
    assert
    , machina
    , HierarchicalGroup
    , hierarchicalBehaviors
    , HierarchicalVariables) {

    var HierarchicalVariablesList = machina.Fsm.extend({
        initialState: 'uninitialized'
        ,namespace: 'hierarchicalVariablesList'
        ,destroy: function(){
            return this.transition('destroyed')
        }
        ,_store: function(hierarchical) {
            var defaultBehaviors = this.behaviors || hierarchicalBehaviors.DEFAULT()
                ;

            assert(hierarchical, 'You should pass a HierarchicalVariables object')
            assert(hierarchical instanceof HierarchicalVariables
                , 'You should pass a valid instance of HierarchicalVariables')


            this.root = HierarchicalGroup.create({
                group: hierarchical.ordered
                , behaviors : defaultBehaviors
            })
        }
        ,applyBehaviors: function(behave) {
            this.behaviors = hierarchicalBehaviors(behave)

            if(this.root) {
                this.root.applyBehaviors(this.behaviors)
            }
        }

        , $events: [
            'hvl.behaviors.update'
        ]

        ,states: {
            uninitialized: {
                initialize: function(opts) {
                    this._store(opts.hierarchicalVariables)
                    this.original = this.root
                    this.transition('initialized')
                }
            }
            ,initialized: {
                _onEnter : function() {
                    this.root.handle('expand')
                }
                , refresh : function(hierarchicalVariables) {
                    this._store(hierarchicalVariables)
                    this.transition('refreshing')
                }
                , rollback : function() {
                    this.root = this.original
                    this.emit('hvl.refreshed')
                }
                , 'hvl.behaviors.update' : function(e, behaviors) {
                    this.applyBehaviors(behaviors)
                }
            }

            , refreshing : {
                _onEnter : function() {
                    this.transition('initialized')
                    this.emit('hvl.refreshed')
                }
            }

            , empty: {
                refresh : function(hierarchicalVariables) {
                    this._store(hierarchicalVariables)
                    this.transition('refreshing')
                }
            }

            ,destroyed: {
                _onEnter: function(){
                    if(this.root) {
                        this.root.destroy()
                    }
                    this.off()
                }
            }
        }
    })

    HierarchicalVariablesList.create = function(cfg) {
        var hvl = new HierarchicalVariablesList()

        hvl.handle('initialize', (cfg || {}))

        return hvl
    }

    return HierarchicalVariablesList
}
