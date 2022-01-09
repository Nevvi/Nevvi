import {makeAutoObservable} from "mobx";
import axios from "axios";

class AuthStore {
    idToken = null
    accessToken = null
    userId = null

    constructor() {
        makeAutoObservable(this)
        this.reload()
    }

    reload() {
        let authentication = localStorage.getItem('Authentication')
        const userId = localStorage.getItem('UserId')

        if (authentication && userId) {
            authentication = JSON.parse(authentication)
            this.setTokenHeaders(authentication.idToken, authentication.accessToken)

            this.setIdToken(authentication.idToken)
            this.setAccessToken(authentication.accessToken)
            this.setUserId(userId)
        }
    }

    get isLoggedIn() {
        return this.idToken != null
    }

    async login(username, password) {
        console.log("Logging in!")
        try {
            const response = await axios.post(
                `/api/authentication/v1/login`,
                {username, password}
            )

            // Globally set auth info
            localStorage.setItem('Authentication', JSON.stringify(response.data))
            this.setTokenHeaders(response.data.idToken, response.data.accessToken)

            // Globally set user id
            localStorage.setItem('UserId', response.data.id)

            this.setIdToken(response.data.idToken)
            this.setAccessToken(response.data.accessToken)
            this.setUserId(response.data.id)
        } catch (e) {
            throw new Error(e.response.data)
        }
    }

    async logout() {
        console.log("Logging out!")

        // Remove locally
        localStorage.removeItem('Authentication')

        // Remove globally
        try {
            await axios.post(
                `/api/authentication/v1/logout`
            )
        } catch (e) {
            console.log(`ERROR: Failed to log out`, e)
        }

        this.setUserId(null)
        this.setAccessToken(null)
        this.setIdToken(null)

        this.clearTokenHeaders()
    }

    setIdToken(idToken) {
        this.idToken = idToken
    }

    setAccessToken(accessToken) {
        this.accessToken = accessToken
    }

    setUserId(userId) {
        this.userId = userId
    }

    setTokenHeaders(idToken, accessToken) {
        axios.defaults.headers.common = {
            "Authorization": idToken,
            "AccessToken": accessToken
        };
    }

    clearTokenHeaders() {
        delete axios.defaults.headers.common['Authorization']
        delete axios.defaults.headers.common['AccessToken']
    }
}

export default AuthStore;