'use strict';

module.exports = HierarchicalBehaviorsFactory

HierarchicalBehaviorsFactory.$inject = [
    '$log'
]

/**
 * @class HierarchicalBehaviorsFactory
 * @classdesc encapsulates behavior options for the hierarchical list and
 * implements observer for subscribers to respond to variable gestures; eg 'click'
 * */
function HierarchicalBehaviorsFactory($log) {
    var defaultOpts = {
        clickable: false
        ,linkable: false
        ,types: []
    }

    function copy(src) {
        var dest = {}
        for(var k in defaultOpts) {
            dest[k] = src[k] || defaultOpts[k]
        }
        return dest
    }


    function HierarchicalBehaviors(cfg){
        cfg = (cfg || {})

        this.clickable = cfg.clickable
        this.linkable = cfg.linkable
        this.strategy = this.getStrategy(cfg)
        this.handlers = []
        this.hideSubvariables = cfg.hideSubvariables
        this.hidePrivateVariables = cfg.hidePrivateVariables
        this.types = (cfg.types || [])
        this.self = cfg.self

    }
    HierarchicalBehaviors.prototype.getStrategy = function(cfg){
        return cfg.linkable ? 'linkable' : 'clickable'
    }

    HierarchicalBehaviors.prototype.isSatisfiedBy = function(item) {
        // variable to select is itself
        if (this.self && item.self === this.self) {
            return false
        }

        if(item.private && this.hidePrivateVariables) {
            return false
        }

        if (!this.types || !this.types.length) {
            //by default everything is ok if there arent any types filtering
            return true
        }

        //Allow nested groups
        if (item.hierarchicalType === 'group') {
            return item.items ? item.items.length > 0 : true
        }

        if (!item.type) {
            //pessimistic...item doesnt have a `type` so cant match
            return false
        }


        return (this.types.indexOf(item.type) > -1)
    }

    HierarchicalBehaviors.prototype.toString = function(){
        return '[' + this.strategy + ']' + this.types.join(',')

    }

    /**
     * @method buildHierarchicalBehaviors
     * @param Object cfg Configuration object  or hierarchicalBehaviors for altering the various controls used in items
     *  @param Boolean locatable - render an `<a/>` tag for variable items
     *  @param Boolean clickable - delegate a `variable.clicked` event, but do no persist the selection
     *  @param Boolean selectable - delegate a `variable:selected` event and persist the selection
     *  @param Boolean linkable - make the element `draggable` with operation of `link`
     * @return Object rich object for configuring list
     * */
    function buildHierarchicalBehaviors(cfg) {
        cfg = (cfg || {})
        var clone = copy(cfg)
        return new HierarchicalBehaviors(cfg)
    }

    buildHierarchicalBehaviors.DEFAULT = function(){
        return buildHierarchicalBehaviors()
    }

    return buildHierarchicalBehaviors
}


