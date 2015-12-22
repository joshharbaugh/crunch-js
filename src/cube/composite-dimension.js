'use strict'

module.exports = CompositeDimensionFactory

CompositeDimensionFactory.$inject = ['lodash']

function CompositeDimensionFactory(_) {

    function CompositeDimension(data) {
        if(typeof(data)=='undefined'){return}
        data.type.elements = data.type.elements.map(function(i){
            return _.extend(i, {hide: i.missing})
        })
        this.data = data
        this.rawData = _.cloneDeep(data)
    }

    CompositeDimension.prototype.applyTransform = function(spec){
        this.data = _.cloneDeep(this.rawData) // reset
        if(!!!spec || !!!spec.elements.length) { return }
        var ext = this.rawData.type.elements
        var sourceIds = _.map(ext, 'id')
        var targetIds = _.map(spec.categories, 'id')
        var source = _.object(sourceIds, ext)
        var target = _.object(targetIds, spec.elements)
        // apply name, missingness, and hide from target
        targetIds.map(function(i){
            source[i] = _.assign(source[i], target[i])
        })
        // permute order: use target, then source
        var resultIds = targetIds.concat(sourceIds).filter(function(v, i, self){
            return self.indexOf(v) === i
        })
        this.extents = resultIds.map(function(i){
            return source[i]
        })
        this.targetPermutation = resultIds.map(function(i){
            return sourceIds.indexOf(i)
        })
        return this // targetPermutation must be applied to data
    }

    Object.defineProperties(CompositeDimension.prototype, {
        'name' : {
            get : function(){
                return this.data.references.name || undefined
            }
        }

        , 'type' : {
            value : 'composite'
        }

        , 'missing' : {
            get : function() {
                return this.data.type.elements.map(function(el) {
                    return el.missing
                })
            }
        }

        , labels : {
            get : function() {
                return this.shownExtents.map(function(el) {
                    return el.value.references.name
                })
            }
        }

        , length : {
            get : function() {
                return this.data.type.elements.length
            }
        }

        , validLength : {
            get : function() {
                return this.validExtents.length
            }
        }

        , 'validExtents' : {
            get : function() {
                return this.extents.filter(function(el) {
                    return el.missing === false
                })
            }
        }
        , 'shownExtents' : {
            get : function() {
                return this.extents.filter(function(el) {
                    return el.hide === false
                })
            }
        }
        , extents : {
            get : function() {
                return this.data.type.elements
            }

            , set : function(value) {
                this.data.type.elements = value
            }
        }

        , 'subscripts' : {
            get: function(){
                return this.data.type.categories.map(function(e, i) { return i })
            }
        }
        , 'missingSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    if(el.missing){
                        out.push(idx)
                        return true
                    }
                })
                return out
            }
        }
        , 'validSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    if (el.missing === false){
                        out.push(idx)
                        return true
                    }
                })
                return out
            }
        }
        , 'shownSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    if (el.hide === false){
                        out.push(idx)
                        return true
                    }
                })
                return out
            }
        }
    })

    return CompositeDimension
}
