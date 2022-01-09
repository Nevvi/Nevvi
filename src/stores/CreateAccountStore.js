import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import axios from "axios";

class LoginStore {
    username = ''
    password = ''
    loading = false

    constructor(routingStore, authStore) {
        makeAutoObservable(this)
        this.routingStore = routingStore
        this.authStore = authStore
    }

    async createAccount() {
        try {
            this.setLoading(true)
            // Create the account
            await axios.post(`/api/authentication/v1/register`, {username: this.username, password: this.password})

            // Log in to the account
            await this.authStore.login(this.username, this.password)

            this.setUsername('')
            this.setPassword('')

            // Default go back to the home page
            this.routingStore.push('/')
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Create account failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    setUsername(username) {
        this.username = username
    }

    setPassword(password) {
        this.password = password
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default LoginStore;