'use strict';

module.exports = HierarchicalVariableFactory
HierarchicalVariableFactory.$inject = [
    'machina'
    ,'bus'
]
function HierarchicalVariableFactory(machina, bus) {
    var factory = {
        create: function(cfg) {
            var varb;

            if(cfg.variable.type === 'categorical_array' && cfg.variable.subvariables && cfg.variable.subvariables.length) {
                varb = CompositeVariable.create(cfg)
            } else {
                varb = ScalarVariable.create(cfg)
            }

            return varb
        }
    }

    /**
     * @class HierarchicalVariable
     * @classdesc The base class for variables used in the hierarchical variables listing;
     * A variable is either `selected` or `deselected` (default).
     * */
    var HierarchicalVariable = machina.Fsm.extend({
        initialState: 'uninitialized'
        ,namespace: 'hierarchicalVariablesList'
        ,destroy: function(){
            this.transition('destroyed')
        }
        ,_click: function(){
            this.emit('clicked', this)
            bus.publish({
                event : 'variable.clicked'
                , variable : this.data
            })
        }
        ,_store: function(){
            throw new Error('not implemented')
        }
        ,applyBehaviors: function(behaviors) {
            this.behaviors = behaviors
        }
        ,states: {
            uninitialized: {
                initialize: function(cfg){
                    this._store(cfg)
                    this.transition('initialized')
                }
            }
            ,initialized : {
                click: function() {
                    this._click()
                }
            }
            ,destroyed: {
                _onEnter: function(){
                    this.off()
                }
            }
        }
    })

    var ScalarVariable = HierarchicalVariable.extend({
        _store: function(cfg) {
            var variable
                ;

            cfg = (cfg || {})
            variable = cfg.variable

            this.self = variable.self
            this.name = variable.prunedName
            this.type = variable.type
            this.alias = variable.alias
            this.url = variable.self
            this.data = variable
            this.parent = cfg.parent
            this.private = variable.private
            this.level = variable.level
            this.behaviors = cfg.behaviors
            this.hierarchicalType = variable.hierarchicalType
        }

        , destroy: function(){
            this.transition('destroyed')
        }
    })

    ScalarVariable.create = function(cfg) {
        var variable = new ScalarVariable()
        variable.handle('initialize',cfg)
        return variable
    }

    var Expansion = machina.Fsm.extend({
        initialState: 'collapsed'
        ,namespace: 'hierarchicalVariablesList'
        ,subvarsLoaded: false
        ,states: {
            collapsed: {
                toggle: function(){
                    var self = this
                        , variable = this.variable
                        ;

                    if (!this.subvarsLoaded) {

                        variable.data.getSubvariables().then(function(subvariables) {
                            subvariables.forEach(function(varTuple) {
                                variable.addSubvariable(varTuple)
                            })

                            return this
                        })
                        .then(function(){
                            self.subvarsLoaded = true
                            self.transition('expanded')
                        }, function(){
                            throw Error('Unable to fetch subvariables')
                        })

                    } else {
                        this.transition('expanded')
                    }
                }
            }
            ,expanded: {
                toggle: function(){
                    this.transition('collapsed')
                }
            }
        }
    })
    var CompositeVariable = HierarchicalVariable.extend({
        _store: function(cfg) {
            var variable
                ;

            cfg = (cfg || {})

            variable = cfg.variable

            this.name = variable.prunedName
            this.self = variable.self
            this.url = variable.self
            this.type = variable.type
            this.composite = true
            this.alias = variable.alias
            this.data = variable
            this.parent = cfg.parent
            this.level = variable.level
            this.subvariables = []
            this.behaviors = cfg.behaviors
            this.hierarchicalType = variable.hierarchicalType
        }

        , addSubvariable : function(subvariableTuple) {
            this.subvariables.push(factory.create({
                variable: subvariableTuple
                , behaviors : this.behaviors
            }))
        }

        , applyBehaviors : function(behaviors) {
            this.behaviors = behaviors

            this.subvariables.forEach(function(subvariable) {
                if(subvariable.applyBehaviors) {
                    subvariable.applyBehaviors(behaviors)
                }
            })
        }

        , initialize: function() {
            this.expansion = new Expansion({
                variable: this
                , subvarsLoaded: false
            })
        }
        ,states: {
            initialized: {
                click: function(){
                    this._click()
                }
            }
        }
    })
    CompositeVariable.create = function(cfg) {
        var variable = new CompositeVariable()
        variable.handle('initialize',cfg)
        return variable
    }
    return factory

}
