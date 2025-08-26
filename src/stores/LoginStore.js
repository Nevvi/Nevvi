import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import {router} from '../router'

class LoginStore {
    username = ''
    password = ''
    showPassword = false
    errors = {}
    loading = false

    constructor(authStore, accountStore, apiClient) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.accountStore = accountStore
        this.api = apiClient
    }

    async login() {
        try {
            this.setLoading(true)
            await this.authStore.login(this.username, this.password)
            await this.accountStore.getUser()
            router.push(this.accountStore.user.onboardingCompleted ? '/' : '/onboarding')
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

    toggleShowPassword() {
        this.showPassword = !this.showPassword
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default LoginStore;