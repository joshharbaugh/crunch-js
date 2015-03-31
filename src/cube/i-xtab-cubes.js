'use strict';

module.exports = IXtabCubes

IXtabCubes.$inject = [
    'cube'
    ,'iResourceVariable'
    ,'ndarray'
    ,'ndarrayUnpack'
    ,'lodash'
    ,'$q'
    ,'$log'
    ,'datetimeFormatter'
    ,'cachedHierarchicalVariables'
    , '$filter'
    , 'tableCellColors'
    , 'svgTextUtil'
    , 'stats'
]

function IXtabCubes(Cube
    , iResourceVariable
    , ndarray
    , unpack
    , _
    , $q
    , $log
    , datetimeFormatter
    , cachedHierarchicalVariables
    , $filter
    , tableCellColors
    , svgTextUtil
    , stats){

    function dft(cube, colPct, rowPct, cellPct, makeCellColors){
        var labels = cube.ravelLabels()
        var dftLabels = []
        labels.forEach(function(lab,i){
            dftLabels.push({})
            lab.forEach(function(each, j){
                dftLabels[i]['var'+j] = lab[j]
            }, this)
            dftLabels[i]['count'] = cube.count.data.toArray()[i]
            dftLabels[i]['colPct']= colPct.toArray()[i]
            dftLabels[i]['cellPct']= cellPct.toArray()[i]
            dftLabels[i]['rowPct']= rowPct.toArray()[i]
            dftLabels[i]['count_weighted'] = cube.count.data.toArray()[i]
            dftLabels[i]['colPct_weighted']= colPct.toArray()[i]
            dftLabels[i]['cellPct_weighted']= cellPct.toArray()[i]
            dftLabels[i]['rowPct_weighted']= rowPct.toArray()[i]

        }, this)
        return dftLabels
    }
    function table(cube){
        if (cube.order.length == 1){
            return [cube.unpack()]
        } else if(cube.length === 0) {
            return [
                [ { '?' : -1 }]
            ]
        }

        return cube.transposed().unpack()
    }

    function calcMarginCols(cube, weighted) {
        var colPct = cube.marginTable({ marginAxis : 0 }).unpack()
            , rowPct = cube.marginTable({ axis : 0, marginAxis : 0 }).unpack()
            ;

        var values = {
            'labels': [ 'All (%)',
                weighted ? 'Total' : 'Valid' ]
            , colPct : colPct
            , rowPct : rowPct
            , cellPct : colPct
            , colPctDiff : colPct
            , rowPctDiff : rowPct
            , cellPctDiff : colPct
            , count: colPct
        }
        var marginCols = {
            'values': values
            ,'values_weighted': values
            ,'orient': 'col'
        }

        marginCols.values.count = marginCols.values.cellPct
        return marginCols
    }

    function calcMarginRows(cube, weighted) {
        var values = {
            'labels': [ 'All (%)',
                weighted ? 'Total' : 'Valid' ]

            , colPct : table(cube.marginTable({
                axis : 1
                , marginAxis : 1
            }))

            , rowPct : table(cube.marginTable({
                marginAxis : 1
            }))

            , cellPct : table(cube.marginTable({
                marginAxis : 1
            }))
            , count: table(cube.marginTable({
                marginAxis : 1
            }))
            , colPctDiff : table(cube.marginTable({
                axis : 1
                , marginAxis : 1
            }))

            , rowPctDiff : table(cube.marginTable({
                marginAxis : 1
            }))

            , cellPctDiff : table(cube.marginTable({
                marginAxis : 1
            }))
        }
        var marginRows = {

            'values': values
            ,'values_weighted': values
            ,'orient': 'row'
        }

        return marginRows
    }

    function formatLabels(labels, variable) {
        if (!!!variable){
            variable = {type: 'default'}
        }
        var formatters = {
            'datetime': function(labels) {
                return labels.map(function(each){
                    return datetimeFormatter(each, dtypeToStrf(variable.rollup_resolution))
                }.bind(this))
            }
            ,'numeric': function(labels) {
                return labels.map(function(each){
                    return each.map(function(num) {
                        var formatted = $filter('number')(num, 2)
                            ;

                        return num - Math.floor(num) > 0 ? formatted : num
                    }).join('\u2013')
                }.bind(this))
            }
            ,'default': function(labels){
                return labels
            }
        }
        return formatters[variable.type] ?
            formatters[variable.type](labels) :
            labels
    }

    function dtypeToStrf(d){
        var strf = {
            's': ':%S',
            'm': '%H:%M',
            'h': '%H:00',
            'D': '%d %b %Y',
            'W': '%Y W%W',
            'M': '%b %Y',
            'Y': '%Y',
        }
        return strf[d] || "%Y-%m-%d"
    }

    function xtabCounts(cube, variables){
        var count = cube.count.data
            , colPct = cube.count.toMarginPercentages({ axis : 1})
            , colPctDiff = cube.count.getDifference({ axis : 1, base: -1})
            , rowPct = cube.count.toMarginPercentages({ axis : 0})
            , rowPctDiff = cube.count.getDifference({ axis : 0, base: -1})
            , cellPct = cube.count.toMarginPercentages()
            , cellPctDiff = cube.count.getDifference({ base: -1 })
            , marginCols = NULL
            , hasArrays = variables.some(function(varb) { return varb.type === 'categorical_array' })
            , hv = cachedHierarchicalVariables.current
            ;

        if(cube.dimension > 1 && !hasArrays) {
            marginCols = calcMarginCols(cube.count, !!cube.weightId)
        }
        var pValues = {
              'rowPct': stats.getPvalues(cube, 0)
            , 'colPct': stats.getPvalues(cube, 1)
            // , 'cellPct':stats.getPvalues(cube, undefined)
        }
        var valueTable = {
            'count': table(count)
            ,'colPct': table(colPct)
            ,'cellPct': table(cellPct)
            ,'rowPct': table(rowPct)

            ,'colPctDiff': table(colPctDiff)
            ,'cellPctDiff': table(cellPctDiff)
            ,'rowPctDiff': table(rowPctDiff)

            ,'rowlabels': formatLabels(cube.labels[0], variables[0])
            ,'orient': 'col'
        }
        var result = {
            'weighted': !!cube.weightId
            ,'subtitle': variables[0].description
            ,'dataFrameTable': dft(cube, colPct, rowPct, cellPct)
            ,'table': {
                'values': valueTable
                ,'values_weighted': valueTable
            }
            ,'collabels': [
                cube.labels.length>1 ? formatLabels(cube.labels[1], variables[1]) : ['']
            ]
            ,'valid_count': cube.n
            ,'margincols': marginCols
            ,'coltitles': [
                variables.length > 1 ? hv.byId(variables[1].self).fullName : ''
            ]
            ,'title': hv.byId(variables[0].self).fullName
            ,'rowtitle' : (variables.length ? hv.byId(variables[0].self).fullName : '')
            ,'missing_count': cube.nMissing
            ,'marginrows': (!hasArrays ? calcMarginRows(cube.count, !!cube.weightId) : undefined)
            ,'displayType': {
                'valueKey': 'count'
                ,'graph': 'barchart'
                ,'format': {
                    'digits': 2
                }
                ,'cellColorScales': {
                    // 'rowPct': tableCellColors.generate({
                    //     table: stats.getPscale(pValues.rowPct.array)
                    // })
                    // ,'colPct': tableCellColors.generate({
                    //     table: stats.getPscale(pValues.colPct.array)
                    // })
                    // ,'cellPct': tableCellColors.getScale({
                    //     table: stats.getPscale(pValues.cellPct)
                    // })
                }
                ,'pValues': pValues
            }
        }
        var types = variables.map(function(each){
            return each.type
        })
        types.forEach(function(t, i){
            if(t === "numeric" && i==0){
                result.displayType.graph = "histogram"
            } else if (t === "datetime" && i==1){
                result.displayType.graph = "timeplot"
                var f = {}
                f.timeaxis = 'var'+i
                f.variables = {}
                f.variables[f.timeaxis] = dtypeToStrf(variables[i].rollup_resolution)

                result.displayType.format = f
            }
        }.bind(this))

        result.analysis = {
            query: cube.query
            ,cube: cube
            ,filters: cube.appliedFilters
            ,weight: cube.weightId
        }
        if(hasArrays){
            result.analysis.display_settings = {percentageDirection:'rowPct'}
        }

        return result
    }

    function xtabMeans(cube, variables, measures){
        // Xtabs only support 1 more dim for tables.
        // Hack to use stddev if 0 or 1 dim;
        // dimlabels of just means if 2.
        function table(cube){
        // internal here; generalized transpose
            if (cube.dimension < 3){
                return [_.flatten(unpack(cube.mean.cube))]
            }

            if (cube.dimension == 3){
                // do not show the SDs
                var means = cube.mean.cube
                var tr = Array(undefined, means.shape.slice().length)
                    .map(function(x, i){return i})
                    .reverse()
                return unpack(means.transpose.apply(means, tr)).map(_.flatten)
            }
        }
        var marginCols = NULL // not currently including counts/missingness
            , hv = cachedHierarchicalVariables.current
            ;

        var valueTable = function(cube){
            if(cube.dimension == 1){
                return {
                    'value': table(cube)
                    ,'rowlabels': ['Mean']
                    ,'orient': 'col'
                }
            } else if (cube.dimension > 1){
                return {
                    'value': table(cube)
                    ,'rowlabels': cube.labels[0]
                    ,'orient': 'col'
                }
            }
        }
        function getColumnLabels(cube){
            if(cube.dimension == 3){
                return cube.labels[1]
            } else {
                return ['Mean']
            }
        }

        function getTitle() {
            return "Average " + meanVariableName()
        }

        function meanVariableName() {
            return hv.byId(measures.getMeasureVariable("mean",0).self).fullName
        }

        function getRowTitle() {
            if(variables.length == 0){
                return ''
            }
            return hv.byId(variables[0].self).fullName
        }

        var result = {
            'weighted': !!cube.weightId
            ,'subtitle': ''
            ,'rowtitle': getRowTitle()
            ,'dataFrameTable': cube.ravelLabels()
            ,'meanvariablename' : meanVariableName()
            ,'table': {
                'values': valueTable(cube)
                ,'values_weighted': valueTable(cube)
            }
            ,'collabels': [
                getColumnLabels(cube)
            ]
            ,'valid_count': cube.n
            ,'margincols': undefined
            ,'coltitles': [
                cube._dimensions.length>1 ? cube._dimensions[1].name : ''
            ]
            ,'title': getTitle()
            ,'missing_count': cube.nMissing
            ,'marginrows': undefined
            ,'displayType': {
                'valueKey': 'value'
                ,'graph': 'dotplot'
                ,'format': {
                    'digits': 2
                }
            }
            ,'analysis': {
                query: cube.query
                ,cube: cube
                ,filters: cube.appliedFilters
                ,weight: cube.weightId
            }
        }
        return result
    }

    return function(input) {
        var cube
            ,variables
            ,measures
            ,result
            ;
        function assert(q) {
            if (!q || !(q.cube || q.variables)) {
                throw new Error(
                    'iXtabCubes requires a CrunchCube and its input variables'
                )
            }
            cube = q.cube
            variables = q.variables
            measures = q.measures
        }
        assert(input)

        if (!!cube.count){
            result = xtabCounts(cube, variables)
        } else if (!!cube.mean){
            result = xtabMeans(cube, variables, measures)
        }
        if(!!input.analysis){
            // came from saved analysis
            result.analysis.display_settings = input.analysis.display_settings
        }
        return $q.when(result)

    }
}
