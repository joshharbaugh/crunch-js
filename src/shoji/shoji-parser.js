'use strict';

/** @exports ShojiParser */
module.exports = ShojiParser

ShojiParser.$inject = [
    'lodash'
    , 'ShojiCollection'
    , 'ShojiCatalogIndex'
    , '$log'
];
/** @class ShojiParser
 * @classdesc Service encapsulating Shoji parsing rules.
 * @return {Function} The parse function for consumers to use.
 * */
function ShojiParser(_, ShojiCollection, ShojiCatalogIndex, $log) {

    function deprecateEntitiesSupport(on) {
        Object.defineProperty(on, 'entities', {
            configurable: true
            ,enumerable: false
            ,get: function(){
                var msg = ('DEPRECATED: `entities` is no longer supported. You need to use `index` instead. \n' +
                    'You received this error because you attempted to access `entities` on a shoji resource at :\n' +
                    '"' + on.self + '"')
                throw new Error(msg)
            }
        })
    }
    /** @class Parser
     * @classdesc Decorates a {@link Resource} instance with attributes
     * based upon Shoji JSON specification.
     * @instance
     * @memberof ShojiParser
     * @constructor
     * */
    function Parser() {
        var self = this;
        var extend = _.extend;
        /** @method isShoji
         * @desc Heuristic for determining whether a JSON object is proper Shoji or not
         * @memberof Parser
         * */
        this.isShoji = function(data) {
            data = data || {};
            var knownShojiElements = [
                'shoji:entity'
                , 'shoji:catalog'
                , 'shoji:value'
                , 'shoji:view'
                , 'shoji:order'
            ];
            var is = !! (data.element && knownShojiElements.indexOf(
                data.element) > -1) && !! data.self;
            return is
        };
        /** @method validate
         * @desc Asserts the JSON `data` is indeed a Shoji resource
         * @instance
         * @memberof Parser
         */
        this.validate = function(data, context) {
            data = data || {};
            var element = data.element;
            if (self.isShoji(data)) {
                switch (element) {
                    case 'shoji:catalog':
                        if (!_.isUndefined(data.entities) && !_.isArray(data.entities)) {
                            throw new Error(
                                'catalog entities must be an Array'
                            )
                        }
                        if (!_.isUndefined(data.index) && !_.isObject(data.index)) {
                            throw new Error(
                                'catalog index must be an Object'
                            )
                        }
                        break;
                    case 'shoji:entity':
                        if (!_.isUndefined(data.urls) && !_.isObject(
                            data.urls)) {
                            throw new Error(
                                'entity urls must be an Object'
                            )
                        }
                        break
                    case 'shoji:view':
                        //nothing to validate
                        if(!data.hasOwnProperty('value')) {
                            throw new Error('shoji:view expects an `value` property')
                        }
                }
            }
            return data
        };

        /** @method parse
         * @desc Decorates appropriate members on a {@link Resource}
         * @memberof Parser
         * @mixes Resource
         */
        this.parse = function(data, context) {
            var target = context || {};
            data = self.validate(data);
            target.self = data.self || target.self;
            if (self.isShoji(data)) {
                target.element = data.element
            } else {
                target.element = 'shoji:value'
            }
            target.specification = data.specification ?
                target.chain(data.specification) : null;
            switch (target.element) {
                case 'shoji:catalog':
                    deprecateEntitiesSupport(target)
                    target.index  = ShojiCatalogIndex.create(target, data.index)
                    target.views = ShojiCollection.parse(target, data.views)
                    target.urls = ShojiCollection.parse(target, data.urls)
                    target.orders = ShojiCollection.parse(target, data.orders)
                    target.catalogs = ShojiCollection.parse(target, data.catalogs)
                    break;
                case 'shoji:entity':
                    extend(target, data.body || {});
                    var col = ShojiCollection.parse(target, data.urls);
                    target.urls = col;
                    target.fragments = ShojiCollection.parse(target, data.fragments);
                    target.views = ShojiCollection.parse(target, data.views);
                    target.catalogs = ShojiCollection.parse(target, data.catalogs);
                    break;
                case 'shoji:view':
                    target.value = data.value
                    break;
                case 'shoji:value':
                    target.value = data;
                    break;
                case 'shoji:order':
                    target.graph = data.graph
                    break;
                default:
                    throw new Error('unknown element type ' +
                        target.element)
            }
            return target
        }
    }

    return new Parser().parse
}

