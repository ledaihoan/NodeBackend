export const API_METHODS = {
    POST_USER: 'POST_USER',
    GET_USER: 'GET_USER',
    GET_PROFILE: 'GET_PROFILE',
    GET_ALL_USERS: 'GET_ALL_USERS',
    GET_ALL_USERS_IN_CONTEXT: 'GET_ALL_USERS_IN_CONTEXT',
    DELETE_USER: 'DELETE_USER',
    UPDATE_USER: 'UPDATE_USER',
    ADD_USER_JOB: 'ADD_USER_JOB',
    RM_USER_JOB: 'RM_USER_JOB'
};

export const userApi = {
    [API_METHODS.POST_USER]: {
        method: 'POST',
        path: '/'
    },
    [API_METHODS.GET_USER]: {
        method: 'GET',
        path: '/:id'
    },
    [API_METHODS.GET_PROFILE]: {
        method: 'GET',
        path: '/profile/get'
    },
    [API_METHODS.GET_ALL_USERS]: {
        method: 'GET',
        path: '/'
    },
    [API_METHODS.GET_ALL_USERS_IN_CONTEXT]: {
        method: 'GET',
        path: '/context/:id'
    },
    [API_METHODS.DELETE_USER]: {
        method: 'DELETE',
        path: '/:id'
    },
    [API_METHODS.UPDATE_USER]: {
        method: 'PUT',
        path: '/update/:id'
    },
    [API_METHODS.ADD_USER_JOB]: {
        method: 'POST',
        path: '/jobs/:id'
    },
    [API_METHODS.RM_USER_JOB]: {
        method: 'DELETE',
        path: '/jobs/:id'
    }
};

export default userApi;