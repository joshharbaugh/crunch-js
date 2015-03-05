'use strict'

module.exports = GroupFactory

GroupFactory.$inject = [
    'lodash'
    , 'iCalculateItemLevel'
]

function GroupFactory(_, iCalculateItemLevel) {
    /**
     * @class Group
     * @classdesc A group of variables
     * @memberof HierarchicalVariablesFactory
     * */
    function Group(name, parent) {
        /**
         * @property String group - the name of this Group
         * @memberof Group.prototype
         * */
        this.id = _.uniqueId(name)
        this.name = name
        this.parent = parent
        /**
         * @property Array items - The group's items {Group}.
         * Where each item can be either a nested group or a variable tuple
         * @memberof Group.prototype
         * */
        this.items = []
    }

    Object.defineProperties(Group.prototype, {
        'hierarchicalType' : {
            value : 'group'
        }

        , 'itemsCount' : {
            get : function() {
                return this.items.length
            }
        }

        , 'level' : {
            get : function() {
                return iCalculateItemLevel(this)
            }
        }
    })

    Group.prototype.addItem = function(item) {
        if(!this.containsItem(item)) {
            this.items.push(item)
        }
    }

    Group.prototype.prependItem = function(item) {
        this.items.unshift(item)
    }

    Group.prototype.removeItem = function(item) {
        var index = this.items.indexOf(item)
            , removed
            ;

        if(index > -1) {
            removed = this.items.splice(index, 1)
        } else {
            throw new Error('this group does not contain the item')
        }

        return removed[0]
    }

    Group.prototype.containsItem = function(item) {
        return this.items.indexOf(item) > -1
    }

    Group.prototype.containsItemNamed = function(name) {
        return !_.isUndefined(this.findItemNamed(name))
    }

    Group.prototype.findItemNamed = function(name) {
        var itemFound
            ;

        this.items.some(function(item) {
            var matches = item.name === name
                ;

            if(matches) {
                itemFound = item
            }

            return matches
        })

        return itemFound
    }

    Group.prototype.switchOrder = function(item1, item2) {
        var firstIndex
            , secondIndex
            ;

        if(!this.containsItem(item1) || !this.containsItem(item2)) {
            throw new Error('one of these items do not belong to this group')
        }

        firstIndex = this.items.indexOf(item1)
        secondIndex = this.items.indexOf(item2)

        this.items[firstIndex] = item2
        this.items[secondIndex] = item1
    }

    Group.prototype.moveItemBefore = function(item, before) {
        var itemIndex
            , beforeIndex
            ;

        if(!this.containsItem(item) || !this.containsItem(before)) {
            throw new Error('one of these items do not belong to this group')
        }

        itemIndex = this.items.indexOf(item)

        this.items.splice(itemIndex, 1)

        beforeIndex = this.items.indexOf(before)

        this.items.splice(beforeIndex, 0, item)
    }

    Group.prototype.insertAfter = function(items, after) {
        var index = this.items.indexOf(after)
            , itemsToInsert = items instanceof Array ? items : [items]
            , self = this
            ;

        if(index === -1) {
            throw new Error('This item does not belong to this group')
        }

        itemsToInsert.forEach(function(item) {
            item.parent = self
        })

        this.items.splice.apply(self.items, [index, 0].concat(itemsToInsert))
    }

    Group.prototype.removeItem = function(item) {
        var index = this.items.indexOf(item)
            ;

        if(index === -1) {
            throw new Error('This item does not belong to this group')
        }

        this.items.splice(index, 1)
    }

    Group.prototype.toJSON = function() {
        var group = {}
            ;

        group[this.name] = this.items.map(function(i) { return i.toJSON() })

        if(!this.parent) {
            group.element = 'shoji:order'
        }

        return group
    }

    return Group
}
