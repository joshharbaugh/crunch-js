;
module.exports = (function() {
    'use strict';
    var hash = {};

    function ShojiOfflineDataStrategy(_, $q) {
        var noop = function() {};

        function Strategy(url) {
            var responseFilters = []
                ,self = this;;
            if (!url) {
                throw new Error('url is required')
            }

            function applyResponseFilters(promise) {
                _.each(responseFilters, function(filter) {
                    promise = promise.then(filter)
                });
                return promise
            }

            function fetch(cfg) {
                var url = cfg.url
                    ,data = hash[url]
                    ,deferred = $q.defer();;
                var response = {
                    config: cfg
                    , data: data
                };
                deferred.resolve(response);
                return deferred.promise
            }
            this.allowAll = function() {};
            this.initialize = function(opts) {
                responseFilters = opts.responseFilters || []
            };
            this.get = function(cfg, success, error) {
                if (_.isFunction(cfg)) {
                    error = success || noop;
                    success = cfg || noop;
                    cfg = {}
                };
                cfg = cfg || {};
                cfg.url = url;
                cfg.success = success || noop;
                cfg.error = error || noop;
                if (!cfg.url) {
                    throw new Error('url is required')
                }
                cfg.method = 'GET';
                var result = fetch(cfg);
                return applyResponseFilters(result)
            };
            this['delete'] = function() {
                var deferred = $q.defer();
                var data = hash[url];
                delete hash[url];
                deferred.resolve({
                    data: data
                });
                return deferred.promise
            };
            this.put = this.post = function() {
                throw new Error(
                    'Writing offline is not supported')
            }
        }
        return Strategy
    }
    ShojiOfflineDataStrategy.mount = function(data) {
        hash = data || {}
    };
    ShojiOfflineDataStrategy.$inject = ['lodash', '$q'];
    return {
        $get: ShojiOfflineDataStrategy
        , mount: ShojiOfflineDataStrategy.mount
    }
})
    .call(this);