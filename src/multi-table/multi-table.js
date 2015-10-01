'use strict';

module.exports = MultiTableFactory

MultiTableFactory.$inject = [
    'lodash'
    ,'$q'
    ,'$filter'
    ,'cube'
    ,'stats'
    ,'ndarrayOps'
    ,'ndarrayScratch'
    ,'ndarrayUnpack'
    ,'show'
    ,'datetimeFormatter'
]
function MultiTableFactory(_, $q, $filter, cube, stats, ops, scratch, unpack, show, datetimeFormatter){
    function MultiTable(){
    }
    function formatPercentage(a){
        return ops.mulseq(a, 100)
    }
    MultiTable.prototype.display = function(settings){
        var body
            ;
        return $q.all(this.cubes).then(function(subcubes){
            var subtables =  subcubes.map(function(subcube){
                if (settings.countsOrPercents.value === 'percent') {
                    body = formatPercentage(stats.propTable(subcube, 1))
                } else {
                    body = subcube.count.cube
                }
                return {
                    rowLabels: subcube.labels[0]
                    ,colLabels: subcube.labels[1]
                    ,body: unpack(body)
                    ,width: subcube.labels[1].length
                }
            }, this)
            var total = stats.margin(subcubes[0]).get(0,0)
            var marginal = scratch.clone(stats.margin(subcubes[0],0))
            ops.divseq(marginal, total)


            function makeSubtableRows(matrix, k){
                return matrix.map(function(row, i){
                    return row.map(function(cell, j){
                        return {
                            value: cell
                            ,class: 'subtable-'+k+' col-'+j
                        }
                    })
                })
            }
            function makeLabels(vector,k){
                return vector.map(function(l,i){
                    return {
                        value: l
                        ,class: 'col-'+i
                    }
                })
            }
            function formatLabels(labels, typeinfo) {
                if (!!!typeinfo){
                    typeinfo = {class: 'default'}
                }
                // hack around no numeric subtype for enums
                if(_.every(labels, function(l){
                        return l instanceof Array
                    })){
                    typeinfo = {class: 'numeric'}
                }
                var formatters = {
                    'datetime': function(labels) {
                        return labels.map(function(each){
                            return datetimeFormatter(each, dtypeToStrf(typeinfo.resolution))
                        }.bind(this))
                    }
                    ,'numeric': function(labels) {
                        return labels.map(function(each){
                            return each.map(function(num) {
                                var formatted = $filter('number')(num, 2)
                                    ;

                                return num - Math.floor(num) > 0 ? formatted : num
                            }).join('\u202f\u2013\u202f') // thin nbsp around endash
                        }.bind(this))
                    }
                    ,'default': function(labels){
                        return labels
                    }
                }
                return formatters[typeinfo.class] ?
                    formatters[typeinfo.class](labels) :
                    labels
            }
            var rowLabels = formatLabels(
                subtables[0].rowLabels,
                subcubes[0]._dimensions[0].type.subtype
            )
            var rowLabels = rowLabels.map(function(l){
                return {
                    value: l
                    ,class: 'row-label'
                }
            })
            var marginrows = _.flatten(unpack(formatPercentage(marginal)), true).map(function(v){
                return {
                    value: v
                    ,class: 'marginal marginal-percentage'
                }
            })
            var colLabels = ['', 'All (%)'].map(function(l){
                return {
                    value: l
                }
            })
            var subrows = subtables.map(function(sub, k){
                colLabels.push(makeLabels(sub.colLabels))
                return makeSubtableRows(sub.body, k)
            }, this)

            var rows = _.zip(marginrows,
                _.zip.apply(this,subrows))
                .map(function(row) {return _.flatten(row, true)})
            colLabels = _.flatten(colLabels)

            var out = {
                rows: rows
                ,colLabels: colLabels
                ,spans: subtables.map(function(t){return t.width })
                ,rowLabels: rowLabels
                ,subtables: subtables
            }
            return out
        })
    }

    return{
        create: function(params){
            var result = new MultiTable()
            result.columns = params.columns
            return $q.when(params.result).then(function(them){
                result.cubes = them
                return result
            })
        }
    }
}
