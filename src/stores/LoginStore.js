import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import {router} from '../router'

class LoginStore {
    username = ''
    password = ''
    loading = false

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
    }

    async login() {
        try {
            this.setLoading(true)
            await this.authStore.login(this.username, this.password)
            router.push('/')
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