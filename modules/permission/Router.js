export const API_METHODS = {
    POST_PERMISSION: 'POST_PERMISSION',
    GET_PERMISSION: 'GET_PERMISSION',
    GET_ALL_PERMISSIONS: 'GET_ALL_PERMISSIONS',
    DELETE_PERMISSION: 'DELETE_PERMISSION',
    UPDATE_PERMISSION: 'UPDATE_PERMISSION'
};

export const contextApi = {
    [API_METHODS.POST_PERMISSION]: {
        method: 'POST',
        path: '/'
    },
    [API_METHODS.GET_PERMISSION]: {
        method: 'GET',
        path: '/:id'
    },
    [API_METHODS.GET_ALL_PERMISSIONS]: {
        method: 'GET',
        path: '/'
    },
    [API_METHODS.DELETE_PERMISSION]: {
        method: 'DELETE',
        path: '/:id'
    },
    [API_METHODS.UPDATE_PERMISSION]: {
        method: 'PUT',
        path: '/:id'
    }
};

export default contextApi;