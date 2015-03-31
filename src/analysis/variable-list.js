'use strict'

module.exports = VariableListFactory

VariableListFactory.$inject = [
    'lodash'
    , '$q'
    , 'cachedHierarchicalVariables'
]

function VariableListFactory(_, $q, cachedHierarchicalVariables) {
    var addStrategies = {
        'categorical_array' : function(varInfo, items) {
            var columnVar = _.cloneDeep(varInfo)
                ;

            varInfo.dimension = "each"
            columnVar.dimension = "variable"
            items.push(varInfo, columnVar)

            return items
        }

        , default : function(varInfo, items) {
            varInfo.dimension = "variable"
            items.push(varInfo)
            return items
        }
    }

    function addVariable(variable) {
        var strategy
            , self = this
            , promise
            ;

        if (typeof variable === 'object') { // if in a saved analysis
            promise = getVariableInfo(variable.self).then(function(varInfo) {
                var clone = varInfo.clone()
                    ;

                clone.dimension = variable.dimension
                self.items = self.items.concat([clone])

                return clone
            })
        } else {
            promise = getVariableInfo(variable).then(function(varInfo) {
                strategy = addStrategies[varInfo.type] || addStrategies.default
                self.items = strategy(varInfo, self.items)
                return varInfo
            })

        }

        return promise
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
            , add = addVariable.bind(this)
            , promise
            , currentCount = this.items.length
            , self = this
            ;

        function request() {
            var item = itemList.shift()
                , p
                ;

            if(item) {
                p = add(item).then(request)
            } else {
                p = $q.when(self.items.slice(currentCount))
            }

            return p
        }

        return request()
    }

    VariableList.prototype.replace = function(index, variableId) {
         var items = this.items
            , promise
            , strategy
            ;

        if(items.length <= index) {
            promise = addVariable.call(this, variableId)
        } else {
            promise = getVariableInfo(variableId).then(function(varInfo) {
                strategy = addStrategies[varInfo.type] || addStrategies.default
                items[index] = strategy(varInfo, [])[0]
                return varInfo
            })
        }

        return promise
    }

    VariableList.prototype.pivot = function(idx1, idx2) {
        var items = this.items
            , variable1 = items[idx1]
            , variable2 = items[idx2]
            ;

        if(!_.isObject(variable1) || !_.isObject(variable2)) {
            throw new Error('Some of the specified variables does not exist')
        }

        items[idx1] = variable2
        items[idx2] = variable1
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
            if(this.items[index].type == 'categorical_array'){
                // remove all the dims from an arrayvar
                var variableId = this.items[index].self
                this.items = this.items.filter(function(i){
                    return i.self != variableId
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
