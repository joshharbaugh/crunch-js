;
module.exports = (function() {
    'use strict';

    function ShojiSerializer(parse, Shoji) {
        return {
            serialize: function(it) {
                var obj = it.getMemento();
                obj.__serializer = it.__serializer;
                return JSON.stringify(obj)
            }
            , deserialize: function(str) {
                var parsed = JSON.parse(str);
                return Shoji(parsed.self)
                    .parse(parsed)
            }
        }
    }
    ShojiSerializer.$inject = ['shojiParser', 'Shoji'];
    return ShojiSerializer
})
    .call(this);