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
            , marginal
        ;
        return $q.all(this.cubes).then(function(subcubes){
            var total = stats.margin(subcubes[0]).get(0,0)
            marginal = scratch.clone(stats.margin(subcubes[0], 0))
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
            if (settings.countsOrPercents.value === 'percent') {
                ops.divseq(marginal,total)
                marginal = formatPercentage(marginal)
            }
            var marginrows = _.flatten(unpack(marginal, true))
            .map(function(v){
                return {
                    value: v
                    ,class: 'marginal marginal-percentage'
                }
            })
            var colLabels = ['All'].map(function(l){
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

            function doSort(){
                if (settings.sortDirection === 0) return
                var subscripts = _.range(0, rows.length)
                if (settings.sortSource==='labels'){
                    subscripts = stats.getSortedSubscripts(
                        rowLabels.map(function(l) {return l.value})
                    )
                }
                if (settings.sortSource==='bodyCols'){
                    var vector = rows.map(function(row) {
                        return row[settings.sortKey].value
                    })
                    subscripts = stats.getSortedSubscripts(vector)
                }
                if(settings.sortDirection && settings.sortDirection.value === -1){
                    subscripts = subscripts.reverse()
                }
                rowLabels = permute(rowLabels, subscripts)
                rows = permute(rows, subscripts)
            }
            function permute(arr, subscripts){
                var out = []
                if(arr===undefined) {
                    return []
                }
                subscripts.forEach(function(i){
                    out.push(arr[i])
                }, this)
                return out
            }

            doSort()
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
