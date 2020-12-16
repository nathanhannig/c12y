import axios from 'axios'
import httpStatus from 'http-status'

const authProvider = {
    // authentication
    // login: (params) => Promise.resolve(),
    checkError: async (error) => {
        const status = error.status;

        if (status === httpStatus.UNAUTHORIZED || status === httpStatus.FORBIDDEN) {
            await axios.get('auth/logout')

            return Promise.reject();
        }

        return Promise.resolve();
    },
    checkAuth: async (params) => {
        try {
            const response = await axios.get('auth/current_user')

            if (response.data.isAdmin) {
                return Promise.resolve();
            }
        } catch (error) {
            return Promise.reject(error)
        }

        return Promise.reject({ message: 'Login required' })
    },
    logout: async () => {
        await axios.get('auth/logout')

        return Promise.resolve()
    },
    getIdentity: async () => {
        try {
            const response = await axios.get('auth/current_user')
            const id = response.data.id
            const fullName = response.data.firstName

            return Promise.resolve({ id, fullName });
        } catch (error) {
            return Promise.reject(error)
        }
    },
    // authorization
    getPermissions: (params) => Promise.resolve(),
}

export default authProvider