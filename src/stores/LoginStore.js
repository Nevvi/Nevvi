import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";

class LoginStore {
    username = ''
    password = ''
    loading = false

    constructor(routingStore, authStore) {
        makeAutoObservable(this)
        this.routingStore = routingStore
        this.authStore = authStore
    }

    async login() {
        try {
            this.setLoading(true)
            await this.authStore.login(this.username, this.password)
            this.routingStore.push('/')
        } catch (e) {
            toast.error(`Login failed because ${e.message}`)
        } finally {
            this.setUsername('')
            this.setPassword('')
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