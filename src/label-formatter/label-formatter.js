;
module.exports = (function() {
    'use strict';

    function LabelFormatter(_, datetimeFormatter, $filter) {
        return function(labels, typeinfo) {
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
    }
    LabelFormatter.$inject = ['lodash', 'datetimeFormatter', '$filter'];
    return LabelFormatter
})
    .call(this);
