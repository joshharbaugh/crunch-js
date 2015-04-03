;
module.exports = (function() {
    'use strict';
    var api = {
        element: 'shoji:entity'
        , self: '/api/'
        , description: 'The API root. GET user_url to access your Crunch resources. GET logout_url to sign out.'
        , urls: {
            roles_url: '/api/roles/users/'
            , logout_url: '/api/logout/'
            , user_url: '/api/users/test_user/'
        }
    };
    var user = {
        element: 'shoji:entity'
        , self: '/api/users/test_user/'
        , specification: '/api/specifications/users/'
        , description: 'Details for a User'
        , body: {
            first_name: 'Jean Luque'
            , last_name: 'Piccard'
            , email: 'email@host.test'
            , id: 'test_user'
        }
        , urls: {
            account_role_url: '/api/accounts/00001/user_roles/5181fc7307a7d81f41bbece1/'
            , invite_url: '/api/users/test_user/invite/'
            , password_reset_url: '/api/users/test_user/password_reset/'
            , account_url: '/api/accounts/00001/'
            , password_url: '/api/users/test_user/password/'
            , sources_url: '/api/users/test_user/sources/'
            , projects_url: '/api/users/test_user/projects/'
            , datasets_url: '/api/users/test_user/datasets/'
        }
    };
    var account = {
        element: 'shoji:entity'
        , self: '/api/accounts/00001/'
        , specification: '/api/specifications/accounts/'
        , description: 'Details for an account'
        , body: {}
        , urls: {
            roles_url: '/api/roles/accounts/'
            , user_account_roles_url: '/api/accounts/00001/user_roles/'
            , users_url: '/api/accounts/00001/users/'
        }
    };
    var users = {
        element: 'shoji:catalog'
        , self: 'https://devtest.crunch.io/api/accounts/00001/users/'
        , specification: 'https://devtest.crunch.io/api/specifications/accounts_users/'
        , description: 'List of users that belong to this account'
        , index: {
            'https://devtest.crunch.io/api/users/test_user/':{}
            , 'https://devtest.crunch.io/api/users/000001/':{}
            , 'https://devtest.crunch.io/api/users/00005/':{}
        }
    };
    return {
        api: api
        , user: user
        , account: account
        , users: users
    }
})
    .call(this);
