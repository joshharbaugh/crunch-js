'use strict';

/** @module ShojiHttpDataStrategyProvider
 */
//This is an angular.provider
module.exports = {
    $get: ShojiHttpDataStrategy
    , mount: ShojiHttpDataStrategy.mount
}

ShojiHttpDataStrategy.$inject = [
    'lodash'
    , '$q'
    , '$http'
    , '$log'
    , 'SHOJI_CFG'
];

/** @class ShojiHttpDataStrategy
 * @classdesc Wraps angular's $http provider and performs lifecycle
 * steps during the course of shoji requests
 */
function ShojiHttpDataStrategy(_, $q, $http, $log, SHOJI_CFG) {
    function noop() {}

    function errorPassthru(err){
        return $q.reject(err)
    }
    function passthru(response) {
        return response
    }

    function Strategy(url, storage) {
        var appliedResponseFilters = []
            ,internalApi
            , methods = ['DELETE', 'GET', 'POST', 'PUT', 'PATCH']
            ,requestCount = 0
            ,storage = storage || $http
            ,strategy = this;;
        if (!url) {
            throw new Error(
                'url is required for data strategy')
        }

        function buildDefaultResponseFilters(opts) {
            function buildRestrictFilter() {
                return function restrictFilter(response) {
                    var allow = response.headers('ALLOW') ||
                        '';
                    restrictMethods(allow);
                    return response
                }
            }

            function buildPostDeleteFilter() {
                return function postDeleteFilter(response) {
                    if (!response || !response.config || !
                        response.config.method) {
                        return response
                    }
                    var meth = response.config.method;
                    if (meth === 'DELETE') {
                        markDeleted()
                    }
                    return response
                }
            }
            var filters = [];
            filters.push(buildRestrictFilter());
            filters.push(buildPostDeleteFilter());
            return filters
        }

        function buildInternalApi() {
            var api = {};
            var defaultOpts = {
                sync: true
            };
            _.each(methods, function(meth) {
                var request = new Request({
                    method: meth
                });
                request.responseFilters(
                    buildDefaultResponseFilters(
                        defaultOpts));
                this[meth] = request
            }, api);
            return api
        }

        function buildPublicApi(target) {
            target = target || {};
            internalApi = internalApi || buildInternalApi();
            _.each(methods, function(meth) {
                var self = this;
                this[meth.toLowerCase()] = function() {
                    var execute = internalApi[meth].execute;
                    return execute.apply(self, arguments)
                }
            }, target);
            return target
        }

        function markDeleted() {
            _.each(methods, function(meth) {
                this[meth].markDeleted()
            }, internalApi);
            return internalApi
        }

        function addNoCacheHeader(config) {
            var headers
                ;

            if(!config) {
                return
            }

            headers = config.headers = config.headers || {}

            headers['Cache-Control'] = 'no-cache'
            return config
        }

        function restrictMethods(allow) {
            var api = internalApi;
            allow = allow || '';
            var allows = _(allow.split(','))
                .map(function(s) {
                    return s.replace(/\s/g, '')
                });
            _.each(methods, function(meth) {
                if (!~allows.indexOf(meth) && meth !==
                    'GET') {
                    this[meth].restrict()
                } else {
                    this[meth].allow()
                }
            }, api);
            return api
        }

        function Request(cfg) {
            var method = cfg.method
                ,responseFilters = []
                ,request = this
                ,validateRequest = noop;
            if (!method) {
                throw new Error('method is required')
            }

            function applyFilters(promise, filters) {;
                filters = filters || [];
                _.each(filters, function(filter) {
                    var errorHandler
                        , successHandler;
                    if (_.isFunction(filter)) {
                        errorHandler = errorPassthru
                        successHandler = filter
                    } else if (_.isObject(filter) &&
                        filter.error) {
                        errorHandler = filter.error || errorPassthru
                        successHandler = filter.success || passthru;
                    }
                    promise = promise.then(successHandler, errorHandler)
                });
                return promise
            }

            function isDiscovering() {
                return !requestCount && method === 'GET'
            }
            this.allow = function() {
                this.validate = validateRequest = function(args) {
                    if (!args.url) {
                        throw new Error('url is required')
                    }
                    if (args.method.toLowerCase() === 'post' ||
                        args.method.toLowerCase() === 'put' ||
                        args.method.toLowerCase() === 'patch') {
                        if (args.data) {
                            return
                        }
                        $log.warn('attempting to ' + args.method +
                            ' to url ' + args.url +
                            ' has no `data` attribute.' +
                            'This seems odd.')
                    }
                }
            };
            this.markDeleted = function() {
                this.validate = validateRequest = function() {
                    throw new Error('Resource at ' + url +
                        ' has been DELETED')
                }
            };
            this.restrict = function() {
                this.validate = validateRequest = function(args) {
                    if (isDiscovering()) {
                        return
                    }
                    var err = new Error('Method \'' + method +
                        '\' not permitted on "' + url +
                        '" The resource may not have been synced to the server;' +
                        ' or, the allow header has indicated it is prohibited.'
                    );
                    throw err
                }
            };
            this.responseFilters = function(filters) {
                if (_.isUndefined(filters)) {
                    return responseFilters
                }
                responseFilters = filters || [];
                return this
            };
            this.execute = function(cfg, success, error) {
                $log.debug('shoji-http-data-strategy' +
                    ' executing request number ' +
                    requestCount + ' on ' + url +
                    ' with method ' + method);
                if (_.isFunction(cfg)) {
                    error = success;
                    success = cfg;
                    cfg = {}
                };
                cfg = cfg || {};;
                cfg.url = url;

                if(cfg.noCache) {
                    cfg = addNoCacheHeader(cfg)
                }

                success = success || passthru;
                error = error || errorPassthru;
                cfg.method = method;
                validateRequest(cfg);
                var result = strategy.makeRequest(cfg);
                requestCount++;
                var filters = responseFilters.concat(cfg.responseFilters || []);
                result = applyFilters(result, filters);
                return result.then(success, error)
            };
            this.restrict()
        }
        this.allowAll = function() {
            return restrictMethods(methods.join(', '))
        };
        this.initialize = function(opts) {
            var responseFilters = [];
            var defaultOpts = {
                responseFilters: []
            };
            opts = _.extend(defaultOpts, opts);
            var responseFilters = buildDefaultResponseFilters(
                opts)
                .concat(opts.responseFilters || []);
            _.each(internalApi, function(request, meth) {
                request.responseFilters(responseFilters)
            });
            return this
        };
        this.makeRequest = function(cfg) {
            return storage(cfg)
        };
        this.restrictAll = function() {
            return restrictMethods()
        };
        buildPublicApi(this)
    }
    return Strategy
}
ShojiHttpDataStrategy.mount = function() {
    throw new Error('not supported for http strategy')
};

