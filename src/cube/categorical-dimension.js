'use strict'

module.exports = CategoricalDimensionFactory

CategoricalDimensionFactory.$inject = ['lodash']

function CategoricalDimensionFactory(_) {

    function CategoricalDimension(data) {
        data.type.categories = data.type.categories.map(function(i){
            return _.extend(i, {hide: i.missing})
        })
        this.data = data
        this.rawData = _.cloneDeep(data)
        this.applyTransform = function(list){
            this.data = _.cloneDeep(this.rawData) // reset
            if(!!!list || !!!list.categories.length) { return }
            var ext = this.rawData.type.categories
            var sourceIds = _.map(ext, 'id')
            var targetIds = _.map(list.categories, 'id')
            var source = _.object(sourceIds, ext)
            var target = _.object(targetIds, list.categories)
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
    }

    Object.defineProperties(CategoricalDimension.prototype, {
        name : {
            get : function(){
                return this.data.references.name || undefined
            }
        }
        , type : {
            value : 'categorical'
        }
        , labels : {
            get : function() {
                return this.validExtents.map(function(cat) {
                    return cat.name
                })
            }
        }
        , missingLabels : {
            get : function() {
                return this.missingExtents.map(function(cat) {
                    return cat.name
                })
            }
        }
        , missing : {
            get : function() {
                return this.data.type.categories.map(function(el) {
                    return el.missing
                })
            }
        }
        , subscripts : {
            get: function() {
                return this.data.type.categories.map(function(e, i) { return i })
            }
        }
        , missingSubscripts : {
            get : function() {
                return this.data.type.categories.reduce(function(accum, el, index) {
                    return el.missing ? accum.concat([index]) : accum
                }, [])
            }
        }
        , validSubscripts : {
            get : function() {
                return this.data.type.categories.reduce(function(accum, el, idx) {
                    return el.missing === false ? accum.concat([idx]) : accum
                }, [])
            }
        }
        , countingSubscripts : {
            get : function() {
                return this.data.type.categories.reduce(function(accum, el, idx) {
                    return el.missing === false ? accum.concat([idx]) : accum

                }, [])
            }
        }
        , shownSubscripts : {
            get : function() {
                return this.data.type.categories.reduce(function(accum, el, idx) {
                    return el.hide === false ? accum.concat([idx]) : accum

                }, [])
            }
        }
        , length : {
            get : function() {
                return this.data.type.categories.length
            }
        }

        , validLength : {
            get : function() {
                return this.validExtents.length
            }
        }

        , extents : {
            get : function() {
                return this.data.type.categories
            }

            , set : function(value) {
                return this.data.type.categories = value
            }
        }

        , missingExtents : {
            get : function() {
                return this.data.type.categories.filter(function(cat) {
                    return cat.missing === true
                })
            }
        }

        , validExtents : {
            get : function() {
                return this.data.type.categories.filter(function(cat) {
                    return cat.missing === false
                })
            }
        }
        , prunedExtents: {
            set : function(replacement) {
                this.data.type.categories = replacement
            }
        }
    })

    return CategoricalDimension
}
