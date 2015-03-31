'use strict';
module.exports = IResourceUsers

IResourceUsers.$inject = ['iResourceAccount'];

function IResourceUsers(iResourceAccount) {
    function assertQuery(q) {
        if (!q) {
            return undefined
        }
        if (!q.userId) {
            throw new Error(
                'userId is required for iResourceUsers')
        }
        return {
            userid: q.userId
        }
    }

    function execute(q) {
        q = assertQuery(q);
        return iResourceAccount.current()
            .then(function(account) {
                return account.urls.users.map({
                    cache: false
                    , params: q
                })
            })
    }
    return execute
}
