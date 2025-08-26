import axios from "axios";


export function createApiClient(authStore) {
    return {
        async apiCall(method, url, data = null, config = {}) {
            try {
                return await axios({
                    method,
                    url,
                    data,
                    ...config
                });
            } catch (error) {
                console.log(`Caught error calling [${method}] ${url}`);
                if (error.response && error.response.status === 401) {
                    console.log("Caught 401. Attempting refresh");
                    try {
                        const refreshed = await authStore.refreshLogin();
                        if (refreshed) {
                            console.log("Refreshed token. Retrying request");
                            return this.apiCall(method, url, data, config);
                        }
                    } catch (refreshError) {
                        console.log('Failed to refresh token:', refreshError);
                    }

                    console.log('Logging out due to 401');
                    await authStore.logout();
                    return Promise.reject(error);
                }
                throw error;
            }
        },

        async get(url, config = {}) {
            return this.apiCall('get', url, null, config);
        },

        async post(url, data = null, config = {}) {
            return this.apiCall('post', url, data, config);
        },

        async patch(url, data = null, config = {}) {
            return this.apiCall('patch', url, data, config);
        },

        async put(url, data = null, config = {}) {
            return this.apiCall('put', url, data, config);
        },

        async delete(url, config = {}) {
            return this.apiCall('delete', url, null, config);
        }
    };
}