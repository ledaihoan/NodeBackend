export const API_METHODS = {
    POST_CONTEXT: 'POST_CONTEXT',
    GET_CONTEXT: 'GET_CONTEXT',
    GET_ALL_CONTEXTS: 'GET_ALL_CONTEXTS',
    GET_ALL_CONTEXTS_IN_CONTEXT: 'GET_ALL_CONTEXTS_IN_CONTEXT',
    DELETE_CONTEXT: 'DELETE_CONTEXT',
    UPDATE_CONTEXT: 'UPDATE_CONTEXT'
};

export const contextApi = {
    [API_METHODS.POST_CONTEXT]: {
        method: 'POST',
        path: '/'
    },
    [API_METHODS.GET_CONTEXT]: {
        method: 'GET',
        path: '/:id'
    },
    [API_METHODS.GET_ALL_CONTEXTS]: {
        method: 'GET',
        path: '/'
    },
    [API_METHODS.GET_ALL_CONTEXTS_IN_CONTEXT]: {
        method: 'GET',
        path: '/context/:id'
    },
    [API_METHODS.DELETE_CONTEXT]: {
        method: 'DELETE',
        path: '/:id'
    },
    [API_METHODS.UPDATE_CONTEXT]: {
        method: 'PUT',
        path: '/:id'
    }
};

export default contextApi;