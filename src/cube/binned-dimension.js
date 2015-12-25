'use strict'

module.exports = BinnedDimensionFactory

BinnedDimensionFactory.$inject = [
    'lodash'
]

function BinnedDimensionFactory(_) {

    function BinnedDimension(data) {
        data.type.elements = data.type.elements.map(function(i){
            return _.extend(i, {hide: i.missing})
        })
        this.data = data
        this.rawData = _.cloneDeep(data)
    }

    BinnedDimension.prototype.applyTransform = function(spec){
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

    Object.defineProperties(BinnedDimension.prototype, {
        'name' : {
            get : function(){
                return this.data.references.name || undefined
            }
        }

        , 'type' : {
            value : 'binned'
        }

        , 'subtype': {
            get: function(){
                return this.data.type.subtype
            }
        }

        ,'labels' : {
            get : function() {
                return this.shownExtents.map(function(el) {
                    return el.value
                })
            }
        }

        , 'missing' : {
            get : function() {
                return this.data.type.elements.map(function(el) {
                    return el.missing
                })
            }
        }

        , 'length' : {
            get : function() {
                return this.data.type.elements.length
            }
        }

        , 'validLength' : {
            get : function() {
                return this.validExtents.length
            }
        }
        , 'extents' : {
            get : function() {
                return this.data.type.elements
            }
        }
        , 'validExtents' : {
            get : function() {
                return this.data.type.elements.filter(function(el) {
                    return el.missing === false
                })
            }
        }
        , 'shownExtents' : {
            get : function() {
                return this.data.type.elements.filter(function(el) {
                    return el.hide === false
                })
            }
        }
        , 'subscripts' : {
            get: function(){
                return this.data.type.elements.map(function(e, i) { return i })
            }
        }
        , 'missingSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    var id = el.value && el.value.id || ''
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
                    var id = el.value && el.value.id || ''
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
        , 'countingSubscripts' : {
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
    })

    return BinnedDimension
}
