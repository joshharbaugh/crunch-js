'use strict'

module.exports = VariableListFactory

VariableListFactory.$inject = [
    'lodash'
    , '$q'
    , 'cachedHierarchicalVariables'
]

function VariableListFactory(_, $q, cachedHierarchicalVariables) {

    var transformStrategies = {
        categoricalArray : function(varInfo) {
            var columnVar = varInfo.clone()
                ;

            varInfo.dimension = "each"
            columnVar.dimension = "variable"

            return [varInfo, columnVar]
        }

        , savedVariable : function(variableInfo, dimensionInfo) {
            var clone = variableInfo.clone()
                ;

            clone.dimension = dimensionInfo.dimension

            return [clone]
        }

        , default : function(varInfo) {
            varInfo.dimension = "variable"
            return [varInfo]
        }

        , executeStrategy : function(variableId, variableInfo) {
            if(typeof variableId === 'object') {
                return this.savedVariable(variableInfo, variableId)
            } else if(variableInfo.type === 'categorical_array') {
                return this.categoricalArray(variableInfo)
            } else {
                return this.default(variableInfo)
            }
        }
    }

    function addVariable(variable) {
        return getVariableInfo((variable.self || variable)).then(function(varInfo) {
            return transformStrategies.executeStrategy(variable, varInfo)
        })
    }

    function getVariableInfo(variableId) {
        var variable = cachedHierarchicalVariables.current.byId(variableId)
            , promise
            ;

        //if we're dealing with a subvariable
        if(variable.contains(variableId)) {
            promise = variable.getSubvariables().then(function() {
                return variable.subvariableById(variableId).map()
            })
        } else {
            promise = variable.map()
        }

        return promise
    }

    function assertDatasetId(datasetId) {
        if(!datasetId) {
            throw new Error('Dataset id is required by the variable list')
        }
    }

    function VariableList(datasetId) {
        assertDatasetId(datasetId)
        this.datasetId = datasetId
        this.items = []
    }

    VariableList.prototype.at = function(idx) {
        return this.items[idx]
    }
    VariableList.prototype.getTypes = function(){
        return this.items.map(function(each){
            return each.type
        })
    }

    VariableList.prototype.add = function(items) {
         var itemList = items instanceof Array ? items : [items]
            , currentCount = this.items.length
            , self = this
            ;

        function request() {
            var item = itemList.shift()
                , p
                ;

            if(item) {
                p = addVariable(item).then(function(items) {
                    self.items = self.items.concat(items)
                    return request()
                })
            } else {
                p = $q.when(self.items.slice(currentCount))
            }

            return p
        }

        return request()
    }

    VariableList.prototype.insertBefore = function(index, variableId) {
        var self = this
            , promise
            ;

        index = index < 0 ? 0 : index

        if(index >= self.items.length) {
            promise = this.add(variableId)
        } else {
            promise = addVariable(variableId).then(function(newItems) {
                self.items.splice.apply(self.items, [index, 0].concat(newItems))
            })
        }

        return promise
    }

    VariableList.prototype.replace = function(index, variableId) {
         var self = this
            ;

        return addVariable(variableId).then(function(newItems) {
            var items = self.items
                ;

            if(index >= items.length) {
                self.items = items.concat(newItems)
            } else {
                items.splice.apply(items, [index, 1].concat(newItems))
            }

            return items[index]
        })
    }

    VariableList.prototype.pivot = function() {
        var items = this.items
            , pivotted = []
            ;

        items.forEach(function(item, index) {
            var next = (index >= items.length - 1) ? 0 : index + 1
                ;

            pivotted[next] = item
        })

        this.items = pivotted
    }

    VariableList.prototype.hasArrays = function() {
        return this.items.some(function(varb) {
            return varb.type === 'categorical_array'
        })
    }

    VariableList.prototype.clean = function() {
        this.items.length = 0
    }

    VariableList.prototype.isEmpty = function() {
        return this.items.length === 0
    }

    VariableList.prototype.count = function() {
        return this.items.length
    }

    VariableList.prototype.remove = function(index) {
        if(!this.isEmpty() && index < this.items.length) {
            if(this.items[index].type === 'categorical_array'){
                // remove all the dims from an arrayvar
                var variableId = this.items[index].self
                this.items = this.items.filter(function(i){
                    return i.self !== variableId
                })
            } else {
                this.items.splice(index, 1)
            }
        } else {
            throw new Error('no variable at this index')
        }
    }

    VariableList.prototype.valueOf = function() {
        return this.items
    }

    return VariableList
}
