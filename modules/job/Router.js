export const API_METHODS = {
    POST_JOB: 'POST_JOB',
    GET_JOB: 'GET_JOB',
    GET_ALL_JOBS: 'GET_ALL_JOBS',
    DELETE_JOB: 'DELETE_JOB',
    UPDATE_JOB: 'UPDATE_JOB'
};

export const contextApi = {
    [API_METHODS.POST_JOB]: {
        method: 'POST',
        path: '/'
    },
    [API_METHODS.GET_JOB]: {
        method: 'GET',
        path: '/:id'
    },
    [API_METHODS.GET_ALL_JOBS]: {
        method: 'GET',
        path: '/'
    },
    [API_METHODS.DELETE_JOB]: {
        method: 'DELETE',
        path: '/:id'
    },
    [API_METHODS.UPDATE_JOB]: {
        method: 'PUT',
        path: '/:id'
    }
};

export default contextApi;